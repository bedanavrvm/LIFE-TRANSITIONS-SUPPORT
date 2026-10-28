import { test, expect, type APIRequestContext } from '@playwright/test';

const backend = 'http://127.0.0.1:3100';
const syntheticPassword = 'Synthetic-test-passphrase-2026';
let token: string;
let serviceID: number;
let freeServiceID: number;
let courseSlug: string;
async function staff(request: APIRequestContext, path: string, method = 'GET', data?: object) {
  return request.fetch(`${backend}/api/${path}`, { method, data, headers: { Authorization: `JWT ${token}` } });
}
const form = { kind: 'care', name: 'Synthetic family', phone: '+254700000001', email: 'family@example.test', preferredContact: 'phone', service: 'home-follow-up', course: '', relationship: 'family', ageGroup: 'adult', area: 'Test area', availability: 'Test afternoon', message: 'Fictional request for a follow-up conversation.', consent: 'on' };

test.beforeAll(async ({ request }) => {
  const login = await request.post(`${backend}/api/users/login`, { data: { email: 'admin@example.test', password: syntheticPassword }, timeout: 120000 });
  expect(login.ok(), await login.text()).toBeTruthy();
  token = (await login.json()).token;
  const services = (await (await request.get(`${backend}/api/services?limit=20`)).json()).docs;
  serviceID = services.find((item: { slug: string }) => item.slug === 'home-follow-up').id;
  freeServiceID = services.find((item: { slug: string }) => item.slug === 'spiritual-bereavement').id;
  courseSlug = (await (await request.get(`${backend}/api/courses`)).json()).docs[0].slug;
});

test('families can browse services, signature packages and both training routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Life changes.');
  await page.screenshot({ path: test.info().outputPath('homepage-desktop.png'), fullPage: true });
  await page.goto('/services');
  await expect(page.locator('.service-card')).toHaveCount(10);
  await page.getByRole('link', { name: 'Explore Spiritual & bereavement support', exact: true }).click();
  await expect(page.getByText('Offered free of charge')).toBeVisible();
  await page.goto('/training');
  await expect(page.locator('.course-card')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /Request private training/ })).toBeVisible();
});

test('a browser request persists privately and gives a reference without confirming an appointment', async ({ page, request }) => {
  await page.goto('/support?service=home-follow-up');
  await page.getByLabel('Your name', { exact: true }).fill('Synthetic browser family');
  await page.getByLabel('Contact phone number').fill('+254700000002');
  await page.getByLabel(/What support would help/).fill('Fictional support enquiry.');
  await page.locator('#consent').check();
  await page.getByRole('button', { name: /Send my request/ }).click();
  await expect(page).toHaveURL(/\/thanks\?reference=LT-/);
  await expect(page.getByText(/confirmed separately/)).toBeVisible();
  const records = await (await staff(request, 'support-requests?where[name][equals]=Synthetic%20browser%20family')).json();
  expect(records.docs).toHaveLength(1);
  expect(records.docs[0].status).toBe('new');
});

test('validation preserves entries, rejects unacknowledged privacy and blocks cross-site submission', async ({ request }) => {
  const invalid = await request.post('/support', { form: { ...form, name: 'Preserved synthetic name', consent: '' } });
  expect(invalid.status()).toBe(400);
  expect(await invalid.text()).toContain('Preserved synthetic name');
  expect(await invalid.text()).toContain('acknowledge');
  const crossSite = await request.post('/support', { form, headers: { Origin: 'https://untrusted.example' } });
  expect(crossSite.status()).toBe(403);
});

test('public API cannot read private records, create arbitrary records, or bootstrap an admin', async ({ request }) => {
  for (const collection of ['support-requests', 'appointments', 'payments', 'users']) {
    const response = await request.get(`${backend}/api/${collection}`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  }
  const injected = await request.post(`${backend}/api/support-requests`, { data: { ...form, status: 'reviewed' } });
  expect(injected.status()).toBeGreaterThanOrEqual(400);
  const internal = await request.post(`${backend}/api/intake`, { data: form });
  expect(internal.status()).toBe(401);
  const bootstrap = await request.post(`${backend}/api/users/first-register`, { data: { email: 'outsider@example.test', password: syntheticPassword } });
  expect(bootstrap.status()).toBe(403);
});

test('care appointment confirmation requires review and payment requires verification', async ({ request }) => {
  const submitted = await request.post('/support', { form, maxRedirects: 0, headers: { Origin: 'http://127.0.0.1:4421' } });
  expect(submitted.status()).toBe(303);
  const results = await (await staff(request, 'support-requests?sort=-createdAt&limit=1')).json();
  const record = results.docs[0];
  const appointment = { request: record.id, startsAt: '2027-03-10T07:00:00Z', endsAt: '2027-03-10T08:00:00Z', location: 'Synthetic test location', status: 'confirmed' };
  const unreviewed = await staff(request, 'appointments', 'POST', appointment);
  expect(unreviewed.status()).toBe(400);
  expect((await staff(request, `support-requests/${record.id}`, 'PATCH', { status: 'reviewed' })).ok()).toBeTruthy();
  const confirmed = await staff(request, 'appointments', 'POST', appointment);
  expect(confirmed.ok(), await confirmed.text()).toBeTruthy();
  const badTime = await staff(request, 'appointments', 'POST', { ...appointment, endsAt: '2027-03-10T06:00:00Z' });
  expect(badTime.status()).toBe(400);
  const paymentResponse = await staff(request, 'payments', 'POST', { request: record.id, amount: 1200.25, checkoutUrl: 'https://example.test/checkout', status: 'pending' });
  expect(paymentResponse.ok(), await paymentResponse.text()).toBeTruthy();
  const payment = (await paymentResponse.json()).doc;
  const publicPage = await request.get(`/payment/${payment.reference}`);
  const html = await publicPage.text();
  expect(html).toContain('does not take payments');
  expect(html).toContain('1,200.25');
  expect(html).not.toContain(form.name);
  expect(html).not.toContain(form.phone);
  expect(html).not.toContain('href="https://example.test/checkout"');
  expect(publicPage.headers()['x-robots-tag']).toContain('noindex');
  const unverified = await staff(request, `payments/${payment.id}`, 'PATCH', { status: 'paid' });
  expect(unverified.status()).toBe(400);
  const verified = await staff(request, `payments/${payment.id}`, 'PATCH', { status: 'paid', verificationReference: 'SYNTHETIC-PROVIDER-REFERENCE' });
  expect(verified.ok(), await verified.text()).toBeTruthy();
  expect(await (await request.get(`/payment/${payment.reference}`)).text()).toContain('Payment verified');
});

test('complimentary support cannot be charged and unsafe checkout URLs are rejected', async ({ request }) => {
  const created = await staff(request, 'support-requests', 'POST', { ...form, consent: true, service: freeServiceID, email: form.email, status: 'reviewed' });
  expect(created.ok(), await created.text()).toBeTruthy();
  const id = (await created.json()).doc.id;
  const updated = await staff(request, `support-requests/${id}`, 'PATCH', { staffNotes: 'Synthetic follow-up note.' });
  expect(updated.ok(), await updated.text()).toBeTruthy();
  expect((await updated.json()).doc).toMatchObject({ relationship: 'family', ageGroup: 'adult', area: form.area, availability: form.availability, phone: form.phone, email: form.email });
  const payment = await staff(request, 'payments', 'POST', { request: id, amount: 500 });
  expect(payment.status()).toBe(400);
  const paidRequest = await staff(request, 'support-requests', 'POST', { ...form, service: serviceID, consent: true, status: 'reviewed' });
  const unsafe = await staff(request, 'payments', 'POST', { request: (await paidRequest.json()).doc.id, amount: 500, checkoutUrl: 'javascript:alert(1)' });
  expect(unsafe.status()).toBe(400);
  const precision = await staff(request, 'payments', 'POST', { request: (await paidRequest.json()).doc.id, amount: 500.123 });
  expect(precision.status()).toBe(400);
});

test('group and private training enquiries are saved with their distinct kinds', async ({ request }) => {
  for (const kind of ['training-group', 'training-private']) {
    const result = await request.post('/support', { form: { ...form, name: `Synthetic ${kind}`, kind, service: '', course: courseSlug, relationship: 'employer', ageGroup: 'not-applicable' }, maxRedirects: 0 });
    expect(result.status()).toBe(303);
    const data = await (await staff(request, `support-requests?where[kind][equals]=${kind}`)).json();
    expect(data.docs.some((item: { kind: string }) => item.kind === kind)).toBeTruthy();
  }
});

test('content editors can publish content but cannot access care data or grant themselves privileges', async ({ request }) => {
  const created = await staff(request, 'users', 'POST', { name: 'Synthetic editor', email: 'editor@example.test', password: syntheticPassword, role: 'editor' });
  expect(created.ok(), await created.text()).toBeTruthy();
  const editor = (await created.json()).doc;
  const login = await request.post(`${backend}/api/users/login`, { data: { email: editor.email, password: syntheticPassword } });
  const editorToken = (await login.json()).token;
  const options = { headers: { Authorization: `JWT ${editorToken}` } };
  const change = await request.patch(`${backend}/api/services/${serviceID}`, { ...options, data: { summary: 'Synthetic edited description.' } });
  expect(change.ok(), await change.text()).toBeTruthy();
  expect((await request.get(`${backend}/api/support-requests`, options)).status()).toBeGreaterThanOrEqual(400);
  expect((await request.patch(`${backend}/api/users/${editor.id}`, { ...options, data: { role: 'admin' } })).status()).toBeGreaterThanOrEqual(400);
  expect((await (await request.get(`${backend}/api/services/${serviceID}`)).json()).summary).toBe('Synthetic edited description.');
});

test('Payload staff sign-in and dashboard render', async ({ page }) => {
  await page.goto(`${backend}/admin/login`);
  await page.locator('input[name="email"]').fill('admin@example.test');
  await page.locator('input[name="password"]').fill(syntheticPassword);
  await page.getByRole('button', { name: /log\s?in/i }).click();
  await expect(page.getByRole('link', { name: /Support Requests/i }).first()).toBeVisible();
});

test('mobile navigation and main journeys fit a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: test.info().outputPath('homepage-mobile.png'), fullPage: true });
  await page.locator('.mobile-nav summary').click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Request support' }).click();
  await expect(page.getByRole('button', { name: /Send my request/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});
