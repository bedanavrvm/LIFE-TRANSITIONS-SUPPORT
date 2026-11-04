import { getPayload } from 'payload';
import { prepareSQLite } from './prepare-sqlite.mjs';
import config from '../apps/cms/src/payload.config.ts';
import { textBody } from '../apps/cms/src/content';
import { courseSeed, serviceSeed } from '@ltsp/shared';

// A one-shot seed must exit even when the development CMS is running.
process.env.DISABLE_PAYLOAD_HMR = 'true';
if (process.env.RENDER === 'true' && process.env.LTSP_TEST_MODE === 'true') throw new Error('Synthetic test credentials must not be seeded on Render.');
await prepareSQLite();
const payload = await getPayload({ config });
for (const [collection, records] of [['services', serviceSeed], ['courses', courseSeed]] as const) {
  for (const record of records) {
    const existing = await payload.find({ collection, where: { slug: { equals: record.slug } }, limit: 1 });
    if (!existing.docs.length) await payload.create({ collection, data: { ...record, _status: collection === 'services' || record.published ? 'published' : 'draft' } });
  }
}
// Upgrade only missing rich-text bodies; never replace later edits or publication choices.
for (const collection of ['services', 'courses']) {
  // shortcut: this bootstrap covers up to 10,000 public entries; paginate before exceeding that catalogue size.
  const records = await payload.find({ collection, limit: 10000, draft: false, depth: 0 });
  for (const record of records.docs) if (!record.body) {
    const history = await payload.findVersions({ collection, where: { parent: { equals: record.id } }, limit: 1 });
    if (history.totalDocs) continue;
    const legacy = collection === 'services' ? 'description' : 'details';
    await payload.update({ collection, id: record.id, data: { body: textBody(String(record[legacy] || '')), _status: collection === 'services' || record.published ? 'published' : 'draft' } });
  }
}
console.log('Service and training seed ready. Existing content preserved; no staff account created.');
if (process.env.LTSP_TEST_MODE === 'true') {
  await payload.create({ collection: 'users', data: { name: 'Test administrator', email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026', role: 'admin' } });
}
await payload.destroy();
// Payload's PostgreSQL adapter retains pool handles after destroy; all writes above are awaited.
process.exit(0);
