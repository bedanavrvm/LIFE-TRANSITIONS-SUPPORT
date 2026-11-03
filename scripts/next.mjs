import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Next copies exec flags into worker NODE_OPTIONS, where --env-file is invalid.
for (const name of ['../.env.local', '../.env']) {
  const envFile = fileURLToPath(new URL(name, import.meta.url));
  if (existsSync(envFile)) loadEnvFile(envFile);
}
await import('next/dist/bin/next');
