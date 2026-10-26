import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

// Next copies exec flags into worker NODE_OPTIONS, where --env-file is invalid.
loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
await import('next/dist/bin/next');
