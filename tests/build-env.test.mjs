import assert from 'node:assert/strict';
import { test } from 'node:test';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function fixture(files = {}) {
  mkdirSync('.test-data', { recursive: true });
  const directory = mkdtempSync(path.resolve('.test-data', 'build-env-'));
  mkdirSync(path.join(directory, 'scripts'));
  copyFileSync('scripts/next.mjs', path.join(directory, 'scripts/next.mjs'));
  for (const [name, value] of Object.entries(files)) writeFileSync(path.join(directory, name), `LTSP_ENV_PROBE=${value}\n`);
  writeFileSync(path.join(directory, 'run.mjs'), "process.on('exit', () => console.log('PROBE=' + process.env.LTSP_ENV_PROBE)); await import('./scripts/next.mjs');\n");
  return directory;
}
function run(directory, injected) {
  const env = { ...process.env };
  delete env.LTSP_ENV_PROBE;
  if (injected) env.LTSP_ENV_PROBE = injected;
  return spawnSync(process.execPath, [path.join(directory, 'run.mjs'), '--version'], { cwd: directory, env, encoding: 'utf8', timeout: 20000 });
}

test('the real Next build helper runs without env files and preserves host-injected variables', () => {
  const result = run(fixture(), 'synthetic-render-value');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Next\.js v/);
  assert.match(result.stdout, /PROBE=synthetic-render-value/);
});
test('optional local env files load with local-file precedence', () => {
  const result = run(fixture({ '.env': 'base', '.env.local': 'local' }));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PROBE=local/);
});
test('injected deployment values take precedence over both local files', () => {
  const result = run(fixture({ '.env': 'base', '.env.local': 'local' }), 'injected');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PROBE=injected/);
});
