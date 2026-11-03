import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { getPayload } from 'payload';
import config from '../apps/cms/src/payload.config.ts';

const payload = await getPayload({ config });
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
