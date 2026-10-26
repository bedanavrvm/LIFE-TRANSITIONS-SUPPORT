import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('data', { recursive: true });
if (!existsSync('.env')) {
  writeFileSync('.env', `PAYLOAD_SECRET=${randomBytes(32).toString('hex')}\nINTERNAL_API_KEY=${randomBytes(32).toString('hex')}\nCMS_URL=http://127.0.0.1:3000\nWEB_URL=http://127.0.0.1:4321\nDEMO_MODE=true\n`, { flag: 'wx' });
  console.log('Created local .env with random secrets. Keep it private.');
}
console.log('Local setup ready. Create the first staff account with npm run admin, then run npm run dev.');
