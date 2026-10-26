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
const output = new Writable({ write(chunk, encoding, done) { if (!hide) process.stdout.write(chunk, encoding); done(); } });
const prompt = createInterface({ input: process.stdin, output, terminal: true });
try {
  const name = (await prompt.question('Your name: ')).trim();
  const email = (await prompt.question('Staff email: ')).trim();
  process.stdout.write('Password (12+ characters, hidden): ');
  hide = true;
  const password = await prompt.question('');
  hide = false;
  process.stdout.write('\n');
  if (!name || !email || password.length < 12) throw new Error('Provide a name, valid email and password with at least 12 characters.');
  await payload.create({ collection: 'users', data: { name, email, password, role: 'admin' } });
  console.log('Administrator created. Sign in at http://127.0.0.1:3000/admin.');
} finally { prompt.close(); await payload.destroy(); }
