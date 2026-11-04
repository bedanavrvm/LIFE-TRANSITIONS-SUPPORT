import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import S3rver from 's3rver';
import sharp from 'sharp';

const directory = path.resolve('.test-data', `media-deployment-${Date.now()}`);
mkdirSync(directory, { recursive: true });
const storage = new S3rver({ port: 4578, address: '127.0.0.1', silent: true, directory, configureBuckets: [{ name: 'ltsp-test-media' }] });
const origin = 'http://127.0.0.1:8080';
const env = { ...process.env, DATABASE_URI: `file:${directory.replaceAll('\\', '/')}/synthetic.sqlite`, PAYLOAD_SECRET: 'synthetic-media-deployment-secret-32-characters', INTERNAL_API_KEY: 'synthetic-media-deployment-api-key-32-characters', WEB_URL: origin, CMS_URL: origin, HOST: '127.0.0.1', PORT: '8080', R2_BUCKET: 'ltsp-test-media', R2_ENDPOINT: 'http://127.0.0.1:4578', R2_ACCESS_KEY_ID: 'S3RVER', R2_SECRET_ACCESS_KEY: 'S3RVER', LTSP_TEST_MODE: 'true', DEMO_MODE: 'true' };
if (process.env.MEDIA_TEST_DATABASE_URI) {
  const uri = new URL(process.env.MEDIA_TEST_DATABASE_URI);
  assert.ok(['localhost', '127.0.0.1'].includes(uri.hostname) && uri.pathname.endsWith('_test'), 'Use a dedicated local PostgreSQL test database.');
  env.DATABASE_URI = uri.href;
}
delete env.RENDER;
delete env.NODE_ENV;
let server;
let logs = '';
async function start() {
  server = spawn(process.execPath, ['scripts/start.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
  for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { logs = (logs + chunk).slice(-30000); });
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    assert.equal(server.exitCode, null, 'Compiled service exited.');
    try { if ((await fetch(`${origin}/healthz`, { signal: AbortSignal.timeout(1000) })).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Compiled service did not become ready.');
}
async function stop() {
  if (server && server.exitCode === null) { const stopped = once(server, 'exit'); server.send('shutdown'); await stopped; }
}
try {
  await storage.run();
  if (process.env.MEDIA_TEST_DATABASE_URI) {
    const migration = spawnSync(process.execPath, ['scripts/payload.mjs', 'migrate'], { env, encoding: 'utf8', timeout: 60000 });
    assert.equal(migration.status, 0, 'Synthetic media migration failed.');
  }
  const seed = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/seed.ts'], { env, encoding: 'utf8', timeout: 60000 });
  assert.equal(seed.status, 0, 'Synthetic media deployment seed failed.');
  delete env.LTSP_TEST_MODE;
  await start();
  const login = await fetch(`${origin}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026' }) });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const image = await sharp({ create: { width: 1200, height: 720, channels: 3, background: '#cfaf69' } }).png().toBuffer();
  const upload = async name => {
    const form = new FormData();
    form.set('_payload', JSON.stringify({ title: name, alt: 'Synthetic test rectangle', approvedForPublicUse: true }));
    form.set('file', new Blob([image], { type: 'image/png' }), 'synthetic.png');
    return fetch(`${origin}/api/media`, { method: 'POST', headers: { Authorization: `JWT ${token}` }, body: form });
  };
  const response = await upload('Synthetic durable asset');
  assert.equal(response.status, 201);
  const asset = (await response.json()).doc;
  const originalURL = new URL(asset.url, origin);
  assert.equal((await fetch(originalURL)).status, 200);
  await stop();
  await start();
  assert.equal((await fetch(originalURL)).status, 200, 'Media must survive the application restart.');
  await storage.close();
  const failed = await upload('Synthetic failed upload');
  assert.ok(failed.status >= 400, 'Unavailable object storage must not report a successful upload.');
  await storage.run();
  assert.equal((await fetch(originalURL)).status, 200, 'The previous file must remain intact after upload failure.');
  assert.equal(logs.includes('Synthetic-test-passphrase-2026'), false);
  console.log('PASS: compiled media upload/download, persistence across app restart, storage failure and recovery preserve existing files. Synthetic local S3 storage only.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally { await stop(); await storage.close(); }
