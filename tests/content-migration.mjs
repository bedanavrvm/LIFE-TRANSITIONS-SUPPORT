import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { Client } from 'pg';
import { PgDialect } from 'drizzle-orm/pg-core';
import { up } from '../apps/cms/src/migrations/postgres/20261102_134951_initial.ts';

// A new local database on the synthetic test cluster; never use an inherited app URL.
const name = `ltsp_content_${Date.now()}_test`;
const cluster = new Client({ connectionString: 'postgresql://ltsp_test@127.0.0.1:5547/postgres' });
await cluster.connect();
await cluster.query(`CREATE DATABASE "${name}"`);
const uri = `postgresql://ltsp_test@127.0.0.1:5547/${name}`;
const database = new Client({ connectionString: uri });
await database.connect();
try {
  const dialect = new PgDialect();
  await up({ db: { execute: statement => database.query(dialect.sqlToQuery(statement).sql) } });
  await database.query("INSERT INTO payload_migrations(name,batch) VALUES ('20261102_134951_initial',1)");
  await database.query("INSERT INTO services(title,slug,number,summary,description,audience) VALUES ('Synthetic legacy service','legacy-service','90','Synthetic summary','Preserve original plain text','Synthetic audience')");
  await database.query("INSERT INTO courses(title,slug,audience,summary,details,published) VALUES ('Legacy public course','legacy-public','Synthetic','Summary','Original public detail',true),('Legacy draft course','legacy-draft','Synthetic','Summary','Original draft detail',false)");
  await database.query("INSERT INTO support_requests(reference,kind,name,email,preferred_contact,consent) VALUES ('SYNTHETIC-MIGRATION','callback','Synthetic private fixture','fixture@example.test','email',true)");
  const privateBefore = JSON.stringify((await database.query('SELECT * FROM support_requests')).rows);
  const env = { ...process.env, DATABASE_URI: uri, DATABASE_URL: uri, PAYLOAD_SECRET: 'synthetic-content-migration-secret-32-characters', INTERNAL_API_KEY: 'synthetic-content-migration-api-key-32-characters' };
  for (const key of ['RENDER','LTSP_TEST_MODE','R2_BUCKET','R2_ENDPOINT','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY']) delete env[key];
  function run(args) {
    const result = spawnSync(process.execPath, args, { env, encoding: 'utf8', timeout: 60000 });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  }
  run(['scripts/payload.mjs', 'migrate']);
  run(['--import', 'tsx', 'scripts/seed.ts']);
  const service = (await database.query("SELECT * FROM services WHERE slug='legacy-service'")).rows[0];
  assert.equal(service._status, 'published');
  assert.equal(service.description, 'Preserve original plain text');
  assert.ok(JSON.stringify(service.body).includes(service.description), JSON.stringify({ body: service.body, description: service.description, status: service._status }));
  const courses = (await database.query("SELECT slug,_status FROM courses WHERE slug LIKE 'legacy-%' ORDER BY slug")).rows;
  assert.deepEqual(courses.map(row => row._status), ['draft', 'published']);
  await database.query("UPDATE services SET description='Staff changed this',body=NULL,_status='draft' WHERE slug='legacy-service'");
  run(['--import', 'tsx', 'scripts/seed.ts']);
  const edited = (await database.query("SELECT description,body,_status FROM services WHERE slug='legacy-service'")).rows[0];
  assert.equal(edited.description, 'Staff changed this');
  assert.equal(edited._status, 'draft');
  const before = JSON.stringify((await database.query('SELECT * FROM services ORDER BY id')).rows);
  run(['scripts/payload.mjs', 'migrate']);
  run(['--import', 'tsx', 'scripts/seed.ts']);
  assert.equal(JSON.stringify((await database.query('SELECT * FROM services ORDER BY id')).rows), before);
  assert.equal(JSON.stringify((await database.query('SELECT * FROM support_requests')).rows), privateBefore);
  console.log('PASS: legacy PostgreSQL content and publication preserved; rich-text backfill respects edits; repeat migration/seed is a no-op.');
} finally {
  await database.end();
  await cluster.query(`DROP DATABASE "${name}"`);
  await cluster.end();
}
