import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import http from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { createProxy } from '../scripts/proxy.mjs';

const servers = [];
let port;
let ready = true;
async function listen(server) {
  servers.push(server);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server.address().port;
}
before(async () => {
  const upstream = name => http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    res.setHeader('Set-Cookie', ['first=one; HttpOnly', 'second=two; HttpOnly']);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name, url: req.url, method: req.method, body, headers: req.headers }));
  });
  const cmsPort = await listen(upstream('cms'));
  const webPort = await listen(upstream('web'));
  port = await listen(createProxy({ website: 'https://care.example.test', cmsPort, webPort, ready: () => ready }));
});
after(async () => { await Promise.all(servers.map(server => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }))); });

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: url, ...options, headers: { Host: 'care.example.test', ...options.headers } }, async res => {
      let body = '';
      for await (const chunk of res) body += chunk;
      resolve({ status: res.statusCode, headers: res.headers, body });
    });
    req.on('error', reject);
    req.end(options.body);
  });
}

test('routes public and staff paths without prefix collisions, including query strings', async () => {
  for (const path of ['/', '/support?service=home-follow-up', '/payment/fictional', '/_astro/site.css', '/apiary', '/administrator']) {
    const response = await request(path);
    assert.equal(response.status, 201);
    assert.equal(JSON.parse(response.body).name, 'web', path);
    assert.equal(JSON.parse(response.body).url, path);
  }
  for (const path of ['/admin', '/admin/login', '/api/services?limit=1', '/_next/static/file.js']) {
    assert.equal(JSON.parse((await request(path)).body).name, 'cms', path);
  }
});
test('preserves POST bodies, auth, origin and multiple cookies; replaces untrusted proxy headers', async () => {
  const response = await request('/support', { method: 'POST', body: 'name=Synthetic', headers: {
    'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'JWT synthetic', Origin: 'https://foreign.example.test',
    'X-Forwarded-Host': 'spoof.example.test', 'X-Forwarded-For': '203.0.113.4', 'X-Forwarded-Proto': 'http',
    'CF-Connecting-IP': '203.0.113.5', Forwarded: 'host=spoof.example.test', 'X-Internal-Key': 'not-allowed',
    Connection: 'keep-alive, x-remove', 'X-Remove': 'remove-me',
  } });
  const data = JSON.parse(response.body);
  assert.equal(data.body, 'name=Synthetic');
  assert.equal(data.method, 'POST');
  assert.equal(data.headers.authorization, 'JWT synthetic');
  assert.equal(data.headers.origin, 'https://foreign.example.test');
  assert.equal(data.headers['x-forwarded-host'], 'care.example.test');
  assert.equal(data.headers['x-forwarded-proto'], 'https');
  assert.equal(data.headers['x-forwarded-for'], '127.0.0.1');
  for (const header of ['forwarded', 'x-internal-key', 'x-remove']) assert.equal(data.headers[header], undefined);
  assert.equal(response.headers['set-cookie'].length, 2);
});
test('rejects foreign hosts and ambiguous paths', async () => {
  assert.equal((await request('/', { headers: { Host: 'foreign.example.test' } })).status, 421);
  for (const path of ['//foreign.test', '/admin/../support', '/api%2f..%2fsupport', '/%invalid', '/admin%5clogin']) {
    assert.equal((await request(path)).status, 400, path);
  }
});
test('health reflects readiness and blocks traffic while starting', async () => {
  assert.equal((await request('/healthz')).status, 200);
  ready = false;
  try {
    assert.equal((await request('/healthz')).status, 503);
    assert.equal((await request('/')).status, 503);
  } finally { ready = true; }
});
test('upstream failure returns a generic error without leaking request details', async () => {
  const temporary = http.createServer();
  const deadPort = await listen(temporary);
  await new Promise(resolve => temporary.close(resolve));
  const proxyPort = await listen(createProxy({ website: 'http://127.0.0.1', cmsPort: deadPort, webPort: deadPort }));
  const response = await new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: proxyPort, path: '/', headers: { Host: '127.0.0.1' } }, async res => {
      let body = '';
      for await (const chunk of res) body += chunk;
      resolve({ status: res.statusCode, body });
    }).on('error', reject);
  });
  assert.equal(response.status, 502);
  assert.doesNotMatch(response.body, /ECONNREFUSED|127\.0\.0\.1|stack/);
});

test('Render mode forwards only a validated edge client IP', async () => {
  const echoPort = await listen(http.createServer((req, res) => res.end(req.headers['x-forwarded-for'])));
  const proxyPort = await listen(createProxy({ website: 'http://127.0.0.1', cmsPort: echoPort, webPort: echoPort, render: true }));
  const forwarded = async value => new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: proxyPort, headers: { Host: '127.0.0.1', 'CF-Connecting-IP': value, 'X-Forwarded-For': 'spoofed' } }, async res => {
      let body = '';
      for await (const chunk of res) body += chunk;
      resolve(body);
    }).on('error', reject);
  });
  assert.equal(await forwarded('203.0.113.9'), '203.0.113.9');
  assert.equal(await forwarded('not-an-IP'), '127.0.0.1');
});

test('Render startup refuses ephemeral SQLite and short secrets before opening any ports', async () => {
  for (const overrides of [{ DATABASE_URI: 'file:synthetic.sqlite' }, { PAYLOAD_SECRET: 'short' }]) {
    const child = spawn(process.execPath, ['scripts/start.mjs'], { env: { ...process.env, RENDER: 'true', WEB_URL: 'https://care.example.test', DATABASE_URI: 'postgresql://synthetic@127.0.0.1/synthetic_test', PAYLOAD_SECRET: 'synthetic-secret-with-at-least-32-characters', INTERNAL_API_KEY: 'synthetic-internal-with-at-least-32-characters', ...overrides }, stdio: ['ignore', 'ignore', 'pipe'] });
    let error = '';
    child.stderr.on('data', chunk => { error += chunk; });
    assert.notEqual((await once(child, 'exit'))[0], 0);
    assert.match(error, /PostgreSQL DATABASE_URL|PAYLOAD_SECRET must contain/);
  }
});
