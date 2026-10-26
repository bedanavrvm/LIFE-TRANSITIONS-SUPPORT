import { spawn } from 'node:child_process';
import { loadEnvFile } from 'node:process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import './setup.mjs';

loadEnvFile('.env');
const testMode = process.argv.includes('--test');
if (testMode) {
  const directory = path.resolve('.test-data', `run-${Date.now()}`);
  mkdirSync(directory, { recursive: true });
  process.env.DATABASE_URI = `file:${path.join(directory, 'test.sqlite').replaceAll('\\', '/')}`;
  process.env.CMS_URL = 'http://127.0.0.1:3100';
  process.env.WEB_URL = 'http://127.0.0.1:4421';
  process.env.DEMO_MODE = 'true';
  process.env.LTSP_TEST_MODE = 'true';
}
const seed = spawn(process.execPath, ['--import', 'tsx', 'scripts/seed.ts'], { stdio: 'inherit' });
const seedCode = await new Promise(resolve => seed.on('exit', resolve));
if (seedCode !== 0) process.exit(Number(seedCode) || 1);

const children = [
  spawn(process.execPath, ['../../node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', testMode ? '3100' : '3000'], { cwd: 'apps/cms', stdio: 'inherit' }),
  spawn(process.execPath, ['../../node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', testMode ? '4421' : '4321', ...(testMode ? ['--ignore-lock'] : [])], { cwd: 'apps/web', stdio: 'inherit' }),
];
function stop() { for (const child of children) child.kill(); }
process.on('SIGINT', () => { stop(); process.exit(); });
process.on('SIGTERM', () => { stop(); process.exit(); });
for (const child of children) child.on('exit', code => { stop(); process.exit(code ?? 1); });
