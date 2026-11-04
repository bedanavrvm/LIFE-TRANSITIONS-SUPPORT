import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { Client } from 'pg';
import { PgDialect } from 'drizzle-orm/pg-core';
import { up } from '../apps/cms/src/migrations/postgres/20261102_134951_initial.ts';

// Exercise Render's exact old dashboard command with an isolated pre-upgrade database.
const name = `ltsp_render_startup_${Date.now()}_test`;
const cluster = new Client({ connectionString: 'postgresql://ltsp_test@127.0.0.1:5547/postgres' });
await cluster.connect();
await cluster.query(`CREATE DATABASE "${name}"`);
const uri = `postgresql://ltsp_test@127.0.0.1:5547/${name}`;
const database = new Client({ connectionString: uri });
await database.connect();
let server;
let logs = '';
try {
  const dialect = new PgDialect();
  await up({ db: { execute: statement => database.query(dialect.sqlToQuery(statement).sql) } });
  await database.query("INSERT INTO payload_migrations(name,batch) VALUES ('20261102_134951_initial',1)");
  await database.query("INSERT INTO services(title,slug,number,summary,description,audience) VALUES ('Synthetic startup control','startup-control','95','Synthetic','Preserve the original content','Synthetic')");
  const env = { ...process.env, RENDER: 'true', DATABASE_URI: uri, DATABASE_URL: uri, DATABASE_URL_UNPOOLED: uri, WEB_URL: 'https://127.0.0.1:8080', PAYLOAD_SECRET: 'synthetic-render-startup-secret-32-characters', INTERNAL_API_KEY: 'synthetic-render-startup-api-key-32-characters', SUPERUSER_EMAIL: 'startup@example.test', SUPERUSER_PASSWORD: 'Synthetic-render-startup-password-2026', SUPERUSER_NAME: 'Synthetic startup administrator', PORT: '8080', CMS_PORT: '3000', ASTRO_PORT: '4321' };
  for (const key of ['NODE_ENV', 'LTSP_TEST_MODE', 'R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) delete env[key];
  server = spawn(process.execPath, ['scripts/start.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
  for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { logs = (logs + chunk).slice(-30000); });
  let response;
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline && server.exitCode === null) {
    try {
      response = await fetch('http://127.0.0.1:3000/api/services?limit=1', { signal: AbortSignal.timeout(2000) });
      break;
    } catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  assert.ok(response, 'The staff server did not open after Render bootstrap.');
  assert.equal(response.status, 200, `Render startup served HTTP ${response.status}; missing-column error 42703: ${logs.includes('42703')}`);
  const service = (await database.query("SELECT body,_status,description FROM services WHERE slug='startup-control'")).rows[0];
  assert.equal(service._status, 'published');
  assert.ok(JSON.stringify(service.body).includes('Preserve the original content'));
  assert.equal(Number((await database.query('SELECT count(*) FROM users')).rows[0].count), 1);
  const prepared = logs.indexOf('Production bootstrap complete.');
  assert.ok(prepared >= 0 && prepared < logs.indexOf('Next.js'));
  assert.ok(!logs.includes(env.SUPERUSER_PASSWORD));
  console.log('PASS: node scripts/start.mjs on Render migrates the old schema, preserves/backfills public content and configures the administrator before serving HTTP 200.');
  const stopped = once(server, 'exit'); server.send('shutdown'); await stopped;
  const hash = (await database.query('SELECT hash FROM users')).rows[0].hash;
  const before = JSON.stringify((await database.query('SELECT * FROM services ORDER BY id')).rows);
  await database.query("INSERT INTO users(name,role,email,hash,salt) SELECT 'Synthetic ordinary staff','care-team','staff@example.test',hash,salt FROM users LIMIT 1");
  for (const [overrides, failedStage] of [
    [{ DATABASE_URI: `${uri}_missing` }, 'migrations'],
    [{ LTSP_TEST_MODE: 'true' }, 'public content'],
    [{ SUPERUSER_EMAIL: 'staff@example.test' }, 'administrator'],
  ]) {
    const result = spawnSync(process.execPath, ['scripts/start.mjs'], { env: { ...env, ...overrides }, encoding: 'utf8', timeout: 30000 });
    assert.equal(result.status, 1, `${failedStage} must stop startup.`);
    const output = result.stdout + result.stderr;
    assert.ok(output.includes(`Production ${failedStage} setup failed; application servers were not started.`));
    assert.ok(!output.includes('Next.js') && !output.includes('Server listening on'));
    assert.ok(!output.includes(env.SUPERUSER_PASSWORD));
  }
  assert.equal((await database.query("SELECT hash FROM users WHERE role='admin'")).rows[0].hash, hash);
  assert.equal(JSON.stringify((await database.query('SELECT * FROM services ORDER BY id')).rows), before);
  console.log('PASS: each bootstrap failure blocks both servers; repeated migrations/seeding preserve content and administrator credentials.');
} finally {
  if (server && server.exitCode === null) { const stopped = once(server, 'exit'); server.send('shutdown'); await stopped; }
  await database.end();
  await cluster.query(`DROP DATABASE "${name}"`);
  await cluster.end();
}
