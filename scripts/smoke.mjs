import { spawn } from 'node:child_process';
import { loadEnvFile } from 'node:process';
import path from 'node:path';

loadEnvFile('.env');
let logs = '';
const children = [
  spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', '3000'], { cwd: 'apps/cms', env: { ...process.env, NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'] }),
  spawn(process.execPath, ['apps/web/dist/server/entry.mjs'], { env: { ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: '4321' }, stdio: ['ignore', 'pipe', 'pipe'] }),
];
for (const child of children) {
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { logs = (logs + chunk).slice(-8000); });
}
async function wait(url) {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    try { const response = await fetch(url); if (response.ok) return response; } catch {}
    await new Promise(resolve => setTimeout(resolve, 350));
  }
  throw new Error(`Built server did not become ready: ${url}`);
}
try {
  const services = await (await wait('http://127.0.0.1:3000/api/services?limit=20')).json();
  if (services.docs.length < 6) throw new Error('Expected the six seeded services. Run npm run seed first.');
  const homepage = await (await wait('http://127.0.0.1:4321/')).text();
  if (!homepage.includes('Life changes.')) throw new Error('Built homepage is missing.');
  if ((await fetch('http://127.0.0.1:4321/support')).status !== 200) throw new Error('Built intake page failed.');
  const invalid = await fetch('http://127.0.0.1:4321/support', {
    method: 'POST',
    headers: { Origin: 'http://127.0.0.1:4321', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ kind: 'care', name: 'Synthetic smoke', phone: '+254700000003', preferredContact: 'phone', relationship: 'self', ageGroup: 'adult' }),
  });
  if (invalid.status !== 400) throw new Error(`Built intake validation failed: ${invalid.status}`);
  if ((await fetch('http://127.0.0.1:3000/api/support-requests')).status < 400) throw new Error('Private records were publicly accessible.');
  console.log('PASS: built Payload/Astro servers, seeded services, SSR homepage/intake, validation and private-record denial. No records created.');
} catch (error) {
  console.error(error.message);
  console.error(logs);
  process.exitCode = 1;
} finally {
  for (const child of children) child.kill();
}
