import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const directory = path.resolve('.test-data', `admin-onboarding-${Date.now()}`);
fs.mkdirSync(directory, { recursive: true });
const password = 'Synthetic-managed-admin-password-2026';
const staffPassword = 'Synthetic-new-staff-password-2026';
const env = { ...process.env, DATABASE_URI: `file:${path.join(directory, 'synthetic.sqlite').replaceAll('\\', '/')}`, DATABASE_URL: 'postgresql://do-not-connect.invalid/production', PAYLOAD_SECRET: 'synthetic-admin-onboarding-secret-32-characters', INTERNAL_API_KEY: 'synthetic-admin-onboarding-api-key-32-characters', WEB_URL: 'http://127.0.0.1:8080', CMS_URL: 'http://127.0.0.1:8080', HOST: '127.0.0.1', PORT: '8080', DEMO_MODE: 'true' };
for (const key of ['RENDER', 'NODE_ENV', 'LTSP_TEST_MODE', 'SUPERUSER_EMAIL', 'SUPERUSER_PASSWORD', 'SUPERUSER_NAME', 'INITIAL_ADMIN_EMAIL', 'INITIAL_ADMIN_PASSWORD', 'INITIAL_ADMIN_NAME']) delete env[key];
const run = (script, extra = {}) => spawnSync(process.execPath, ['--import', 'tsx', `scripts/${script}.ts`], { env: { ...env, ...extra }, encoding: 'utf8', timeout: 30000 });
const seed = run('seed');
assert.equal(seed.status, 0, seed.stderr);
let logs = '';
const server = spawn(process.execPath, ['scripts/start.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { logs = (logs + chunk).slice(-30000); });
let browser;
try {
  const deadline = Date.now() + 120000;
  let ready = false;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error('Compiled server exited.');
    try { if ((await fetch(`${env.WEB_URL}/healthz`, { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, 'Compiled server not ready.');
  browser = await chromium.launch();
  const page = await browser.newPage();
  // HTTP/2 responses have no reason phrase; recreate the deployed browser's error handling.
  await page.addInitScript(() => {
    const original = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await original(...args);
      if (response.url.includes('/api/users/first-register')) return new Response(await response.arrayBuffer(), { status: response.status, headers: response.headers, statusText: '' });
      return response;
    };
  });
  await page.goto(`${env.WEB_URL}/admin`);
  await page.locator('input[name="name"]').fill('Synthetic first-user attempt');
  await page.locator('input[name="email"]').fill('blocked@example.test');
  for (const input of await page.locator('input[type="password"]').all()) await input.fill(password);
  await page.waitForTimeout(1500);
  const blockedResponse = page.waitForResponse(response => response.url().includes('/api/users/first-register'));
  await page.getByRole('button', { name: /^create$/i }).click();
  const blocked = await blockedResponse;
  assert.equal(blocked.status(), 403);
  const blockedJSON = await blocked.json();
  assert.match(blockedJSON.errors[0].message, /Public account registration is closed/);
  assert.match(blockedJSON.requestId, /^[a-f0-9-]{36}$/);
  await page.getByText(/Public account registration is closed/).waitFor();
  assert.ok(!(await page.locator('body').innerText()).includes('An unknown error'));
  const bootstrap = run('create-admin', { SUPERUSER_EMAIL: 'managed@example.test', SUPERUSER_PASSWORD: password, SUPERUSER_NAME: 'Synthetic managed administrator' });
  assert.equal(bootstrap.status, 0, bootstrap.stderr);
  await page.goto(`${env.WEB_URL}/admin/login`);
  await page.getByRole('textbox', { name: /email/i }).fill('managed@example.test');
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /log.?in/i }).click();
  await page.waitForURL(url => url.pathname === '/admin');
  async function fillUser() {
    await page.goto(`${env.WEB_URL}/admin/collections/users/create`);
    await page.locator('input[name="name"]').fill('Synthetic staff user');
    await page.locator('input[name="email"]').fill('staff@example.test');
    for (const input of await page.locator('input[type="password"]').all()) await input.fill(staffPassword);
    await page.waitForTimeout(1200);
  }
  await fillUser();
  const createdResponse = page.waitForResponse(response => response.request().method() === 'POST' && new URL(response.url()).pathname === '/api/users');
  await page.getByRole('button', { name: /^save$/i }).click();
  const created = await createdResponse;
  assert.equal(created.status(), 201);
  await page.waitForURL(/\/admin\/collections\/users\/\d+/);
  await fillUser();
  const duplicateResponse = page.waitForResponse(response => response.request().method() === 'POST' && new URL(response.url()).pathname === '/api/users');
  await page.getByRole('button', { name: /^save$/i }).click();
  const duplicate = await duplicateResponse;
  assert.equal(duplicate.status(), 400);
  const duplicateJSON = await duplicate.json();
  assert.match(duplicateJSON.requestId, /^[a-f0-9-]{36}$/);
  assert.ok(logs.includes('payload_request_failed'));
  assert.ok(logs.includes(duplicateJSON.requestId));
  for (const secret of [password, staffPassword, 'managed@example.test', 'staff@example.test', 'Synthetic staff user']) assert.ok(!logs.includes(secret), 'Private value found in runtime logs.');
  fs.writeFileSync(path.join(directory, 'runtime.log'), logs);
  console.log('PASS: HTTP/2 first-account errors show a clear setup message; env-managed admin login and browser user creation work; duplicate-email errors have correlated runtime logs without credentials or user values.');
} catch (error) {
  console.error(error.message);
  fs.writeFileSync(path.join(directory, 'runtime.log'), logs.replaceAll(password, '[REDACTED]').replaceAll(staffPassword, '[REDACTED]'));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) { const stopped = once(server, 'exit'); server.send('shutdown'); await stopped; }
}
