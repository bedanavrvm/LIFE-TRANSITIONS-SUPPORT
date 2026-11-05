import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

// This dedicated database contains only synthetic fixtures, never local development/client data.
const neonEnv = process.env.NEON_VERIFICATION_ENV ? parseEnv(readFileSync(process.env.NEON_VERIFICATION_ENV, 'utf8')) : null;
const database = neonEnv?.DATABASE_URL || process.env.DEPLOYMENT_TEST_DATABASE_URI || 'postgresql://ltsp_test@127.0.0.1:5547/ltsp_deploy_test';
const databaseURL = new URL(database);
if (neonEnv) {
  const productionEnv = parseEnv(readFileSync('.env', 'utf8'));
  assert.ok(neonEnv.NEON_BRANCH?.startsWith('ltsp-setup-verification'), 'Use a dedicated Neon verification branch.');
  assert.notEqual(neonEnv.NEON_BRANCH, productionEnv.NEON_BRANCH);
  assert.ok(databaseURL.hostname.endsWith('.neon.tech'));
  assert.notEqual(databaseURL.hostname, new URL(productionEnv.DATABASE_URL).hostname, 'Never write test records to the production connection.');
} else {
  assert.ok(['localhost', '127.0.0.1'].includes(databaseURL.hostname) && databaseURL.pathname.endsWith('_test'), 'Use a dedicated local PostgreSQL test database.');
}
const origin = 'http://127.0.0.1:8080';
const env = { ...process.env, DATABASE_URL: database, DATABASE_URL_UNPOOLED: neonEnv?.DATABASE_URL_UNPOOLED || database, PAYLOAD_SECRET: 'synthetic-deployment-secret-2026-at-least-32', INTERNAL_API_KEY: 'synthetic-internal-key-for-deployment-2026', WEB_URL: origin, HOST: '127.0.0.1', PORT: '8080', CMS_PORT: '3000', ASTRO_PORT: '4321', DEMO_MODE: 'true' };
delete env.DATABASE_URI;
delete env.RENDER;
delete env.LTSP_TEST_MODE;
let server;
let browser;
let output = '';
async function start() {
  server = spawn(process.execPath, ['scripts/start.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
  output = '';
  for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { output = (output + chunk).slice(-10000); });
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Combined service stopped: ${output}`);
    try { if ((await fetch(`${origin}/healthz`, { signal: AbortSignal.timeout(1000) })).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Combined service not ready: ${output}`);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const exited = once(server, 'exit');
  server.send('shutdown');
  await exited;
  assert.equal(server.exitCode, 0, 'Graceful combined-service shutdown');
}
async function staff(path, token, method = 'GET', data) {
  return fetch(`${origin}/api/${path}`, { method, headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' }, body: data ? JSON.stringify(data) : undefined });
}
try {
  await start();
  const smoke = spawn(process.execPath, ['scripts/smoke-deployment.mjs'], { env, stdio: 'inherit' });
  assert.equal((await once(smoke, 'exit'))[0], 0);
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/admin/login`);
  await page.getByRole('textbox', { name: /email/i }).fill('admin@example.test');
  await page.getByLabel(/password/i).fill('Synthetic-test-passphrase-2026');
  await page.getByRole('button', { name: /log.?in/i }).click();
  await page.waitForURL(url => url.pathname === '/admin', { timeout: 30000 });
  assert.ok((await page.context().cookies()).some(cookie => cookie.name === 'payload-token'), 'Staff login must set its session cookie through the proxy.');
  await page.reload();
  assert.equal(new URL(page.url()).pathname, '/admin');
  const login = await fetch(`${origin}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026' }) });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const settingsResponse = await staff('globals/site-settings', token, 'POST', { responseNote: 'Synthetic combined deployment check.' });
  assert.equal(settingsResponse.status, 200);
  await page.goto(`${origin}/contact`);
  assert.ok((await page.textContent('body')).includes('Synthetic combined deployment check.'), 'CMS edits must appear without rebuilding.');
  const before = (await (await staff('support-requests?limit=1', token)).json()).totalDocs;
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const formPage = await noJS.newPage();
  await formPage.goto(`${origin}/support?service=home-follow-up`);
  await formPage.getByLabel('Your name', { exact: true }).fill('Synthetic combined deployment family');
  await formPage.getByLabel('Contact phone number').fill('+254700000002');
  await formPage.getByLabel(/What support would help/).fill('Fictional deployment test.');
  await formPage.locator('#consent').check();
  await formPage.getByRole('button', { name: /Send my request/ }).click();
  await formPage.waitForURL(/\/thanks\?reference=LT-/);
  assert.equal((await (await staff('support-requests?limit=1', token)).json()).totalDocs, before + 1);
  const saved = (await (await staff('support-requests?limit=1&sort=-createdAt', token)).json()).docs[0];
  const review = await staff(`request-workflow/${saved.id}/status`, token, 'POST', { status: 'reviewed', revision: saved.workflowRevision });
  assert.equal(review.status, 200);
  const reviewedRequest = (await review.json()).doc;
  const notes = await Promise.all(['Synthetic first follow-up', 'Synthetic second follow-up'].map(text => staff('request-workflow/' + saved.id + '/note', token, 'POST', { text })));
  assert.deepEqual(notes.map(response => response.status), [201, 201]);
  const raced = await Promise.all(['First closure reason', 'Second closure reason'].map(reason => staff('request-workflow/' + saved.id + '/status', token, 'POST', { status: 'closed', revision: reviewedRequest.workflowRevision, reason })));
  assert.deepEqual(raced.map(response => response.status).sort(), [200, 409]);
  const closedRequest = await (await staff('support-requests/' + saved.id, token)).json();
  assert.equal((await staff('request-workflow/' + saved.id + '/status', token, 'POST', { status: 'reviewed', revision: closedRequest.workflowRevision })).status, 200);
  const activity = await (await staff('request-activity?where[request][equals]=' + saved.id, token)).json();
  assert.equal(activity.totalDocs, 5);
  assert.equal((await staff('support-requests/' + saved.id, token, 'PATCH', { name: 'Attempted replacement' })).status, 403);
  await page.goto(origin + '/admin/requests/' + saved.id);
  await page.getByRole('heading', { name: 'Original request', exact: true }).waitFor();
  await page.getByText('Synthetic first follow-up', { exact: true }).waitFor();
  await page.screenshot({ path: '.test-data/request-inbox-compiled-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: '.test-data/request-inbox-compiled-phone.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
  const paymentResponse = await staff('payments', token, 'POST', { request: saved.id, amount: 100, status: 'pending' });
  assert.equal(paymentResponse.status, 201);
  const payment = (await paymentResponse.json()).doc;
  await formPage.goto(payment.publicUrl);
  assert.ok((await formPage.textContent('h1')).includes('Your agreed payment'));
  assert.ok(!(await formPage.textContent('body')).includes(saved.name), 'Payment page must not disclose the requester.');
  const editorResponse = await staff('users', token, 'POST', { name: 'Synthetic editor', email: `editor-${Date.now()}@example.test`, password: 'Synthetic-editor-password-2026', role: 'editor' });
  assert.equal(editorResponse.status, 201);
  const editor = (await editorResponse.json()).doc;
  const editorLogin = await fetch(`${origin}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: editor.email, password: 'Synthetic-editor-password-2026' }) });
  const editorToken = (await editorLogin.json()).token;
  assert.equal((await staff('support-requests', editorToken)).status, 403);
  assert.equal((await staff('payments', editorToken)).status, 403);
  assert.equal((await staff('services?limit=1', editorToken)).status, 200);
  assert.deepEqual(errors, []);
  await noJS.close();
  await browser.close(); browser = null;
  await stop();
  await start();
  const persisted = await staff(`support-requests/${saved.id}`, token);
  assert.equal(persisted.status, 200);
  assert.equal((await persisted.json()).status, 'reviewed');
  assert.equal((await staff(`payments/${payment.id}`, token)).status, 200);
  console.log(`PASS: ${neonEnv ? 'Neon verification branch' : 'Local PostgreSQL'} combined build, staff browser login/cookies, immediate CMS edits, no-JavaScript intake, private payment view, editor restrictions and persistence across restart. Synthetic test database only.`);
} catch (error) {
  console.error(error.message);
  if (browser) for (const context of browser.contexts()) for (const page of context.pages()) console.error((await page.locator('body').innerText()).slice(0, 2000));
  console.error(output);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await stop();
}
