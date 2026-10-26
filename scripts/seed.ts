import { getPayload } from 'payload';
import config from '../apps/cms/src/payload.config.ts';
import { courseSeed, serviceSeed } from '@ltsp/shared';

// A one-shot seed must exit even when the development CMS is running.
process.env.DISABLE_PAYLOAD_HMR = 'true';
const payload = await getPayload({ config });
for (const [collection, records] of [['services', serviceSeed], ['courses', courseSeed]] as const) {
  for (const record of records) {
    const existing = await payload.find({ collection, where: { slug: { equals: record.slug } }, limit: 1 });
    if (!existing.docs.length) await payload.create({ collection, data: record });
  }
}
console.log('Service and training seed ready. Existing content preserved; no staff account created.');
if (process.env.LTSP_TEST_MODE === 'true') {
  await payload.create({ collection: 'users', data: { name: 'Test administrator', email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026', role: 'admin' } });
}
await payload.destroy();
