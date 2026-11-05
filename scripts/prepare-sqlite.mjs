import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Upgrade legacy SQLite atomically before Drizzle's development schema push attempts table rebuilds.
async function prepareContentSQLite() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || `file:${path.resolve('data/development.sqlite')}`;
  if (!uri.startsWith('file:')) return;
  const file = uri.startsWith('file://') ? fileURLToPath(uri) : uri.slice(5);
  if (!existsSync(file)) return;
  const { DatabaseSync, backup } = await import('node:sqlite');
  const db = new DatabaseSync(file);
  try {
    const columns = table => new Set(db.prepare(`PRAGMA table_info("${table}")`).all().map(column => column.name));
    const serviceColumns = columns('services');
    if (!serviceColumns.size || serviceColumns.has('body')) return;
    await backup(db, `${file}.before-cms-upgrade-${Date.now()}.bak`);
    const schema = JSON.parse(readFileSync(new URL('./sqlite-cms-schema.json', import.meta.url), 'utf8'));
    db.exec('PRAGMA foreign_keys=OFF');
    db.exec('BEGIN IMMEDIATE');
    try {
      for (const entry of schema.filter(item => item.type === 'table')) {
        const existing = columns(entry.name);
        if (!existing.size) { db.exec(entry.sql); continue; }
        if (!['services', 'courses', 'site_settings', 'payload_locked_documents_rels'].includes(entry.name)) continue;
        const temporary = `_cms_new_${entry.name}`;
        db.exec(entry.sql.replace(`\`${entry.name}\``, `\`${temporary}\``));
        const target = columns(temporary);
        if ([...existing].some(name => !target.has(name))) throw new Error('Unexpected SQLite columns: upgrade stopped without discarding existing fields.');
        const shared = [...existing].filter(name => target.has(name)).map(name => `"${name}"`).join(',');
        db.exec(`INSERT INTO "${temporary}" (${shared}) SELECT ${shared} FROM "${entry.name}"`);
        db.exec(`DROP TABLE "${entry.name}"`);
        db.exec(`ALTER TABLE "${temporary}" RENAME TO "${entry.name}"`);
        if (entry.name === 'services' && !existing.has('_status')) db.exec("UPDATE services SET _status='published'");
        if (entry.name === 'courses' && !existing.has('_status')) db.exec("UPDATE courses SET _status=CASE WHEN published THEN 'published' ELSE 'draft' END");
      }
      for (const entry of schema.filter(item => item.type === 'index')) db.exec(entry.sql.replace('CREATE UNIQUE INDEX ', 'CREATE UNIQUE INDEX IF NOT EXISTS ').replace('CREATE INDEX ', 'CREATE INDEX IF NOT EXISTS '));
      if (db.prepare('PRAGMA foreign_key_check').all().length) throw new Error('SQLite upgrade failed its foreign-key check; restored the original transaction.');
      if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('SQLite upgrade failed its integrity check; restored the original transaction.');
      db.exec('COMMIT');
      console.log('Local SQLite content upgrade prepared; backup saved beside the database.');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  } finally { db.exec('PRAGMA foreign_keys=ON'); db.close(); }
}

export async function prepareSQLite() {
  await prepareContentSQLite();
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || 'file:' + path.resolve('data/development.sqlite');
  if (!uri.startsWith('file:')) return;
  const file = uri.startsWith('file://') ? fileURLToPath(uri) : uri.slice(5);
  if (!existsSync(file)) return;
  const { DatabaseSync, backup } = await import('node:sqlite');
  const db = new DatabaseSync(file);
  try {
    const columns = table => new Set(db.prepare('PRAGMA table_info("' + table + '")').all().map(column => column.name));
    const existing = columns('support_requests');
    if (!existing.size || existing.has('workflow_revision')) return;
    await backup(db, file + '.before-request-inbox-' + Date.now() + '.bak');
    db.exec('BEGIN IMMEDIATE');
    try {
      db.exec("ALTER TABLE support_requests ADD COLUMN workflow_revision text DEFAULT 'legacy'");
      db.exec("ALTER TABLE support_requests ADD COLUMN source text DEFAULT 'legacy'");
      db.exec('ALTER TABLE support_requests ADD COLUMN captured_by_id integer REFERENCES users(id) ON DELETE SET NULL');
      db.exec('ALTER TABLE support_requests ADD COLUMN captured_by_name text');
      db.exec('ALTER TABLE support_requests ADD COLUMN original_request_id integer REFERENCES support_requests(id) ON DELETE SET NULL');
      db.exec('ALTER TABLE payload_locked_documents_rels ADD COLUMN request_activity_id integer REFERENCES request_activity(id) ON DELETE CASCADE');
      const schema = JSON.parse(readFileSync(new URL('./sqlite-request-schema.json', import.meta.url), 'utf8'));
      for (const entry of schema) db.exec(entry.sql);
      db.exec('CREATE INDEX support_requests_captured_by_idx ON support_requests(captured_by_id)');
      db.exec('CREATE INDEX support_requests_original_request_idx ON support_requests(original_request_id)');
      if (db.prepare('PRAGMA foreign_key_check').all().length || db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Request inbox upgrade failed database integrity checks.');
      db.exec('COMMIT');
      console.log('Local SQLite request inbox upgrade prepared; backup saved beside the database.');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  } finally { db.close(); }
}
