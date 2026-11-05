import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { prepareSQLite } from '../scripts/prepare-sqlite.mjs';

test('legacy SQLite requests and notes survive additive inbox upgrade and repeat startup', async () => {
  const folder = path.resolve('.test-data', 'request-upgrade-' + Date.now());
  fs.mkdirSync(folder, { recursive: true });
  const file = path.join(folder, 'synthetic.sqlite');
  let db = new DatabaseSync(file);
  const schema = JSON.parse(fs.readFileSync('scripts/sqlite-cms-schema.json', 'utf8'));
  for (const entry of schema.filter(item => item.type === 'table')) db.exec(entry.sql);
  for (const entry of schema.filter(item => item.type === 'index')) db.exec(entry.sql);
  db.exec('CREATE TABLE users(id integer PRIMARY KEY); CREATE TABLE support_requests(id integer PRIMARY KEY,reference text,kind text,status text,name text,phone text,preferred_contact text,consent integer,staff_notes text)');
  db.exec("INSERT INTO support_requests(reference,kind,status,name,phone,preferred_contact,consent,staff_notes) VALUES ('LT-SYNTHETIC','care','reviewed','Synthetic legacy family','+254700000040','phone',1,'Preserve the original legacy note')");
  const before = db.prepare('SELECT * FROM support_requests').get();
  db.close();
  const inherited = process.env.DATABASE_URI;
  process.env.DATABASE_URI = 'file:' + file.replaceAll('\\', '/');
  try {
    await prepareSQLite();
    await prepareSQLite();
    db = new DatabaseSync(file, { readOnly: true });
    const after = db.prepare('SELECT * FROM support_requests').get();
    for (const [key, value] of Object.entries(before)) assert.equal(after[key], value, key);
    assert.equal(after.source, 'legacy');
    assert.equal(after.workflow_revision, 'legacy');
    assert.equal(db.prepare('SELECT count(*) AS total FROM request_activity').get().total, 0);
    assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
    assert.equal(db.prepare('PRAGMA foreign_key_check').all().length, 0);
    assert.equal(fs.readdirSync(folder).filter(name => name.includes('.before-request-inbox-')).length, 1);
    db.close();
  } finally {
    if (inherited === undefined) delete process.env.DATABASE_URI;
    else process.env.DATABASE_URI = inherited;
  }
});
