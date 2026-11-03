import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Neon migrations need the direct connection; explicit DATABASE_URI overrides remain isolated.
const migrationEnv = process.argv[2]?.startsWith('migrate') && !process.env.DATABASE_URI && process.env.DATABASE_URL_UNPOOLED
  ? { DATABASE_URI: process.env.DATABASE_URL_UNPOOLED }
  : {};
// Run Payload with the CMS tsconfig and host-injected environment.
const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/payload/bin.js', import.meta.url)), ...process.argv.slice(2)], {
  cwd: fileURLToPath(new URL('../apps/cms', import.meta.url)),
  env: { ...process.env, ...migrationEnv, DISABLE_PAYLOAD_HMR: 'true' },
  stdio: 'inherit',
});
child.on('error', () => { console.error('Could not start Payload CLI.'); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
