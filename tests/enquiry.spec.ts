import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { requestKinds, requestSchema } from '../packages/shared/src/index';

const backend = 'http://127.0.0.1:3100';
const enquiry = { kind: 'care', name: 'Synthetic short enquiry', preferredContact: 'email', email: 'short@example.test', consent: 'on' };

test('shared validation requires only the selected contact and leaves deferred details unset', () => {
  for (const kind of requestKinds) {
    const input = { ...enquiry, kind, course: kind === 'training-group' ? 'safe-baby-care' : '', consent: true };
    const result = requestSchema.parse(input);
    expect(result.phone).toBe('');
    expect(result.relationship).toBeUndefined();
    expect(result.ageGroup).toBeUndefined();
    for (const preferredContact of ['phone', 'whatsapp']) {
      expect(requestSchema.safeParse({ ...input, email: '', preferredContact }).success).toBe(false);
      expect(requestSchema.safeParse({ ...input, email: '', preferredContact, phone: '+254700000009' }).success).toBe(true);
    }
  }
  for (const changes of [{ email: '' }, { email: 'invalid' }, { preferredContact: 'phone', phone: 'invalid' }, { consent: false }, { kind: 'training-group', course: '' }, { status: 'reviewed' }]) {
    expect(requestSchema.safeParse({ ...enquiry, consent: true, ...changes }).success).toBe(false);
  }
});

test('the short form shows the chosen contact and relevant course without discarding typed values', async ({ page }) => {
  await page.goto('/support');
  await expect(page.locator('.field:visible')).toHaveCount(5);
  await expect(page.locator('[name="relationship"], [name="ageGroup"], [name="area"], [name="availability"]')).toHaveCount(0);
  await page.getByLabel('Your name', { exact: true }).fill('Synthetic preserved name');
  await page.getByLabel('Contact phone number').fill('+254700000009');
  await page.getByLabel('How should we reply?').selectOption('email');
  await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
  await expect(page.locator('#email')).toHaveAttribute('required', '');
  await expect(page.locator('#phone')).toBeHidden();
  await expect(page.locator('#phone')).toBeDisabled();
  await page.getByLabel('How should we reply?').selectOption('whatsapp');
  await expect(page.locator('#phone')).toHaveValue('+254700000009');
  await expect(page.locator('#name')).toHaveValue('Synthetic preserved name');

  await page.goto('/support?kind=training-group&course=safe-baby-care&service=caregiver-training');
  await expect(page.locator('.enquiry-context')).toContainText('Safe baby care');
  await expect(page.locator('.enquiry-context')).toContainText('Caregiver education & training');
  await expect(page.locator('#course')).toHaveValue('safe-baby-care');
  await expect(page.locator('#course')).toHaveAttribute('required', '');
  await page.locator('#kind').selectOption('training-private');
  await expect(page.locator('#course')).not.toHaveAttribute('required', '');
  await page.locator('#kind').selectOption('care');
  await expect(page.locator('#course')).toBeHidden();
  await expect(page.locator('#course')).toBeDisabled();
});

test('all five minimal enquiry kinds save privately, including email without a phone', async ({ request }) => {
  const login = await request.post(`${backend}/api/users/login`, { data: { email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026' } });
  expect(login.ok()).toBeTruthy();
  const headers = { Authorization: `JWT ${(await login.json()).token}` };
  for (const kind of requestKinds) {
    const contact = kind === 'callback' ? { preferredContact: 'whatsapp', phone: '+254700000009', email: '' } : { preferredContact: 'email', email: enquiry.email };
    const result = await request.post('/support', { form: { ...enquiry, ...contact, kind, name: `Synthetic minimal ${kind}`, course: kind === 'training-group' ? 'safe-baby-care' : '' }, maxRedirects: 0 });
    expect(result.status(), await result.text()).toBe(303);
    const reference = new URL(result.headers().location, 'http://127.0.0.1:4421').searchParams.get('reference');
    const records = await (await request.get(`${backend}/api/support-requests?where[reference][equals]=${reference}`, { headers })).json();
    const record = records.docs[0];
    expect(record).toMatchObject({ kind, preferredContact: contact.preferredContact, status: 'new', consent: true });
    if (kind === 'callback') { expect(record.phone).toBe(contact.phone); expect(record.email).toBeFalsy(); }
    else { expect(record.email).toBe(enquiry.email); expect(record.phone).toBeFalsy(); }
    expect(record.relationship).toBeFalsy();
    expect(record.ageGroup).toBeFalsy();
    expect(record.course != null).toBe(kind === 'training-group');
    expect((await request.post(`${backend}/api/request-workflow/${record.id}/status`, { headers, data: { status: 'reviewed', revision: record.workflowRevision } })).ok()).toBeTruthy();
    expect((await request.patch(`${backend}/api/support-requests/${record.id}`, { headers, data: { preferredContact: kind === 'callback' ? 'email' : 'phone' } })).status()).toBe(403);
  }
});

test('server errors link to the active field and preserve the enquiry and consent', async ({ page }) => {
  await page.goto('/support?kind=referral&service=home-follow-up');
  await page.locator('#name').fill('Synthetic validation preservation');
  await page.locator('#phone').fill('invalid');
  await page.locator('#message').fill('Fictional message to preserve.');
  await page.locator('#consent').check();
  const response = page.waitForResponse(response => response.url().endsWith('/support') && response.request().method() === 'POST');
  await page.getByRole('button', { name: /Send my request/ }).click();
  expect((await response).status()).toBe(400);
  await expect(page.locator('#form-errors')).toBeFocused();
  await expect(page.locator('#phone-error')).toContainText('phone number');
  await expect(page.locator('#phone')).toHaveAttribute('aria-describedby', 'phone-help phone-error');
  await page.locator('#form-errors a[href="#phone"]').click();
  await expect(page.locator('#phone')).toBeFocused();
  await expect(page.locator('#name')).toHaveValue('Synthetic validation preservation');
  await expect(page.locator('#kind')).toHaveValue('referral');
  await expect(page.locator('[name="service"]')).toHaveValue('home-follow-up');
  await expect(page.locator('#message')).toHaveValue('Fictional message to preserve.');
  await expect(page.locator('#consent')).toBeChecked();
});

test('missing contact, missing course, unchecked privacy and a filled honeypot are rejected by the server', async ({ request }) => {
  for (const changes of [{ email: '' }, { kind: 'training-group' }, { consent: '' }, { website: 'synthetic-bot' }]) {
    const response = await request.post('/support', { form: { ...enquiry, ...changes } });
    expect(response.status(), await response.text()).toBe(400);
    expect(await response.text()).toContain(enquiry.name);
  }
});

test('unavailable incoming context is discarded and an unavailable submitted course has a useful error', async ({ page, request }) => {
  await page.goto('/support?kind=training-group&service=missing-service&course=missing-course');
  await expect(page.locator('[name="service"]')).toHaveValue('');
  await expect(page.locator('#course')).toHaveValue('');
  await expect(page.locator('.enquiry-context')).toBeHidden();
  const response = await request.post('/support', { form: { ...enquiry, kind: 'training-group', course: 'missing-course' } });
  expect(response.status()).toBe(400);
  expect(await response.text()).toContain('This course is unavailable');
});

test('without JavaScript the labelled alternatives still accept an email-only callback', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4421/support?kind=callback');
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#course')).toBeVisible();
    await page.locator('#name').fill('Synthetic no-script enquiry');
    await page.locator('#preferredContact').selectOption('email');
    await page.locator('#email').fill('no-script@example.test');
    await page.locator('#consent').check();
    await page.getByRole('button', { name: /Send my request/ }).click();
    await expect(page).toHaveURL(/\/thanks\?reference=LT-/);
  } finally { await context.close(); }
});

test('a backend outage preserves entries and offers an honest retry message', async ({ page, request }) => {
  test.setTimeout(120000);
  const unavailable = createServer((_, response) => { response.writeHead(503); response.end(); });
  await new Promise<void>(resolve => unavailable.listen(0, '127.0.0.1', resolve));
  const address = unavailable.address();
  if (!address || typeof address === 'string') throw new Error('Missing test backend address.');
  const web = spawn(process.execPath, ['../../node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', '4422', '--ignore-lock'], {
    cwd: 'apps/web', stdio: 'ignore', env: { ...process.env, CMS_URL: `http://127.0.0.1:${address.port}`, WEB_URL: 'http://127.0.0.1:4422', DEMO_MODE: 'true' },
  });
  try {
    await expect.poll(async () => { try { return (await request.get('http://127.0.0.1:4422/support')).status(); } catch { return 0; } }, { timeout: 60000 }).toBe(200);
    expect((await request.get('http://127.0.0.1:4422/services/home-follow-up')).status()).toBe(503);
    await page.goto('http://127.0.0.1:4422/support?kind=callback');
    await page.locator('#name').fill('Synthetic backend outage');
    await page.locator('#preferredContact').selectOption('email');
    await page.locator('#email').fill('outage@example.test');
    await page.locator('#message').fill('Fictional preserved message.');
    await page.locator('#consent').check();
    const response = page.waitForResponse(response => response.url().endsWith('/support') && response.request().method() === 'POST');
    await page.getByRole('button', { name: /Send my request/ }).click();
    expect((await response).status()).toBe(503);
    await expect(page.locator('#form-errors')).toContainText('Your entries are still below');
    await expect(page.locator('#name')).toHaveValue('Synthetic backend outage');
    await expect(page.locator('#email')).toHaveValue('outage@example.test');
    await expect(page.locator('#message')).toHaveValue('Fictional preserved message.');
    await expect(page.locator('#kind')).toHaveValue('callback');
    await expect(page.locator('#consent')).toBeChecked();
  } finally {
    web.kill();
    await new Promise<void>(resolve => unavailable.close(() => resolve()));
  }
});
