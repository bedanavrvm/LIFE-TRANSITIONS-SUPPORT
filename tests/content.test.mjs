import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { prepareSQLite } from '../scripts/prepare-sqlite.mjs';
import { safeBody } from '../packages/shared/src/rich-content.ts';
import { textBody, plainText } from '../apps/cms/src/content.ts';

test('rich text preserves literal text and restricts unsafe structure and URLs', () => {
  const content = textBody('<script>literal text</script>\n\nSecond paragraph');
  assert.equal(plainText(safeBody(content)), '<script>literal text</script>\n\nSecond paragraph');
  assert.equal(plainText({ type: 'list', children: [{ type: 'listitem', children: [{ text: 'First' }] }, { type: 'listitem', children: [{ text: 'Second' }] }] }), 'First\n\nSecond');
  assert.equal(plainText({ type: 'linebreak' }), '\n');
  const link = { type: 'link', version: 1, children: [], fields: { url: 'javascript:alert(1)' } };
  assert.throws(() => safeBody(link));
  assert.throws(() => safeBody({ type: 'heading', tag: 'script', children: [] }));
  assert.throws(() => safeBody({ type: 'html', html: '<script>bad</script>' }));
  assert.equal(safeBody({ type: 'link', children: [], fields: { url: '/services/home-follow-up' } }).fields.url, '/services/home-follow-up');
});

test('Lexical resolves the patched Happy DOM release after a clean installation', () => {
  const require = createRequire(import.meta.url);
  const headless = createRequire(require.resolve('@lexical/headless'));
  assert.equal(headless('happy-dom/package.json').version, '21.0.4');
});

test('missing R2 credentials reject uploads before any file storage is attempted', async () => {
  for (const key of ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) delete process.env[key];
  const { Media } = await import('../apps/cms/src/media.ts');
  await assert.rejects(Media.hooks.beforeOperation[0]({ operation: 'create', req: { file: { mimetype: 'image/png', data: Buffer.from('synthetic'), size: 9 } } }), /Sign in to manage public media/);
  await assert.rejects(Media.hooks.beforeOperation[0]({ operation: 'create', req: { user: { role: 'admin' }, file: { mimetype: 'image/png', data: Buffer.from('synthetic'), size: 9 } } }), /Media storage is not configured/);
});

test('legacy SQLite preflight makes a backup, preserves private rows and maps publication once', async () => {
  mkdirSync('.test-data', { recursive: true });
  const file = path.resolve('.test-data', `sqlite-preflight-${Date.now()}.sqlite`);
  const previous = process.env.DATABASE_URI;
  process.env.DATABASE_URI = `file:${file.replaceAll('\\', '/')}`;
  let db = new DatabaseSync(file);
  db.exec("CREATE TABLE services(id INTEGER PRIMARY KEY,title TEXT); INSERT INTO services VALUES (1,'Synthetic'); CREATE TABLE courses(id INTEGER PRIMARY KEY,published INTEGER); INSERT INTO courses VALUES (1,1),(2,0); CREATE TABLE site_settings(id INTEGER PRIMARY KEY); CREATE TABLE private_fixture(id INTEGER PRIMARY KEY,value TEXT); INSERT INTO private_fixture VALUES (1,'Synthetic private text');");
  db.close();
  try {
    await prepareSQLite();
    db = new DatabaseSync(file);
    assert.equal(db.prepare('SELECT _status FROM services').get()._status, 'published');
    assert.deepEqual(db.prepare('SELECT _status FROM courses ORDER BY id').all().map(row => row._status), ['published', 'draft']);
    assert.equal(db.prepare('SELECT value FROM private_fixture').get().value, 'Synthetic private text');
    db.exec("UPDATE services SET _status='draft'");
    db.close();
    await prepareSQLite();
    db = new DatabaseSync(file);
    assert.equal(db.prepare('SELECT _status FROM services').get()._status, 'draft');
    const backups = readdirSync(path.dirname(file)).filter(name => name.startsWith(`${path.basename(file)}.before-cms-upgrade-`));
    assert.equal(backups.length, 1);
    db.close();
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URI; else process.env.DATABASE_URI = previous;
  }
});

test('SQLite preflight rolls back when an unexpected field would be discarded', async () => {
  const file = path.resolve('.test-data', `sqlite-unknown-${Date.now()}.sqlite`);
  const previous = process.env.DATABASE_URI;
  process.env.DATABASE_URI = `file:${file.replaceAll('\\', '/')}`;
  const db = new DatabaseSync(file);
  db.exec("CREATE TABLE services(id INTEGER PRIMARY KEY, custom_field TEXT); INSERT INTO services VALUES (1,'Synthetic preserved value');");
  try {
    await assert.rejects(prepareSQLite(), /Unexpected SQLite columns/);
    assert.equal(db.prepare('SELECT custom_field FROM services').get().custom_field, 'Synthetic preserved value');
    assert.equal(db.prepare('PRAGMA table_info(services)').all().some(row => row.name === 'body'), false);
  } finally {
    db.close();
    if (previous === undefined) delete process.env.DATABASE_URI; else process.env.DATABASE_URI = previous;
  }
});
