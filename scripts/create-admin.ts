import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { createHmac } from 'node:crypto';
import { getPayload } from 'payload';
import config from '../apps/cms/src/payload.config.ts';
import { safeError } from './observability.mjs';

const payload = await getPayload({ config });
const superuserEmail = process.env.SUPERUSER_EMAIL?.trim().toLowerCase();
const superuserPassword = process.env.SUPERUSER_PASSWORD;
if (superuserEmail || superuserPassword || process.env.SUPERUSER_NAME) {
  try {
    if (!superuserEmail || !superuserPassword || superuserPassword.length < 12) throw new Error('Set SUPERUSER_EMAIL and SUPERUSER_PASSWORD (at least 12 characters) together.');
    const existing = (await payload.find({ collection: 'users', where: { email: { equals: superuserEmail } }, limit: 1, depth: 0, overrideAccess: true, showHiddenFields: true })).docs[0];
    if (existing && existing.role !== 'admin') throw new Error('SUPERUSER_EMAIL belongs to a non-administrator. Choose an administrator email.');
    const name = process.env.SUPERUSER_NAME?.trim() || existing?.name || 'Website administrator';
    const digest = (value: string) => createHmac('sha256', process.env.PAYLOAD_SECRET!).update(value).digest('hex');
    const desired = digest(JSON.stringify([superuserEmail, name, superuserPassword]));
    const key = existing ? `ltsp-superuser:${existing.id}` : '';
    const previous = key ? await payload.kv.get<{ desired: string; credential: string }>(key) : null;
    // A keyed fingerprint avoids resetting credentials/sessions on every Render Free wake.
    if (!existing || previous?.desired !== desired || previous.credential !== digest(String(existing.hash || ''))) {
      const data = { name, email: superuserEmail, password: superuserPassword, role: 'admin', loginAttempts: 0, lockUntil: null };
      const user = existing
        ? await payload.update({ collection: 'users', id: existing.id, data, overrideAccess: true, showHiddenFields: true })
        : await payload.create({ collection: 'users', data, overrideAccess: true, showHiddenFields: true });
      await payload.kv.set(`ltsp-superuser:${user.id}`, { desired, credential: digest(String(user.hash || '')) });
      console.log('Managed superuser credentials configured.');
    } else console.log('Managed superuser already configured; credentials preserved.');
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'superuser_configuration_failed', error: safeError(error) }));
    console.error('Check SUPERUSER_EMAIL, SUPERUSER_PASSWORD and that the matching account is an administrator.');
    process.exitCode = 1;
  } finally { await payload.destroy(); }
  process.exit(process.exitCode || 0);
}
if ((await payload.count({ collection: 'users' })).totalDocs > 0) {
  console.log('A staff account already exists. Manage additional accounts from Payload.');
  await payload.destroy();
  process.exit(0);
}
let hide = false;
let prompt: ReturnType<typeof createInterface> | undefined;
try {
  let name = process.env.INITIAL_ADMIN_NAME?.trim() || 'Website administrator';
  let email = process.env.INITIAL_ADMIN_EMAIL?.trim();
  let password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) {
    if (email || password || !process.stdin.isTTY) throw new Error('Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD in Render environment settings to create the first administrator.');
    const output = new Writable({ write(chunk, encoding, done) { if (!hide) process.stdout.write(chunk, encoding); done(); } });
    prompt = createInterface({ input: process.stdin, output, terminal: true });
    name = (await prompt.question('Your name: ')).trim();
    email = (await prompt.question('Staff email: ')).trim();
    process.stdout.write('Password (12+ characters, hidden): ');
    hide = true;
    password = await prompt.question('');
    hide = false;
    process.stdout.write('\n');
  }
  if (!name || !email || password.length < 12) throw new Error('Provide a name, valid email and password with at least 12 characters.');
  await payload.create({ collection: 'users', data: { name, email, password, role: 'admin' } });
  console.log(`Administrator created. Sign in at ${process.env.CMS_URL || process.env.WEB_URL || 'http://127.0.0.1:3000'}/admin/login.`);
} finally { prompt?.close(); await payload.destroy(); }
// Payload's PostgreSQL adapter retains pool handles after destroy; account creation has completed.
process.exit(0);
