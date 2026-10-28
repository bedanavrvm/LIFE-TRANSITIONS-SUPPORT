import { execFileSync } from 'node:child_process';
import { test } from '@playwright/test';

for (const origin of ['https://preview.example.test', 'http://preview.example.test', 'https://preview.example.test:8443', 'http://127.0.0.1:4321']) {
  test(`configured proxy origin accepts ${origin} and rejects another host`, () => {
    execFileSync(process.execPath, ['--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      import config from './apps/web/astro.config.mjs';
      import { validateForwardedHeaders } from './node_modules/astro/dist/core/app/validate-headers.js';
      const origin = new URL(process.env.WEB_URL);
      const protocol = origin.protocol.slice(0, -1);
      const allowed = config.security.allowedDomains;
      assert.equal(validateForwardedHeaders(protocol, origin.host, undefined, allowed).host, origin.host);
      assert.equal(validateForwardedHeaders(protocol, 'untrusted.example.test', undefined, allowed).host, undefined);
    `], { env: { ...process.env, WEB_URL: origin }, stdio: 'pipe' });
  });
}
