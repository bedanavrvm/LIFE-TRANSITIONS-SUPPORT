import { test, expect, type APIRequestContext } from '@playwright/test';
import sharp from 'sharp';

const cms = 'http://127.0.0.1:3100';
let admin: string, editor: string, care: string;
let appointmentReference: string;
const password = 'Synthetic-test-passphrase-2026';
const body = (text: string) => ({ root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'text', version: 1, text, format: 1, detail: 0, mode: 'normal', style: '' }] }] } });
const auth = (token: string) => ({ Authorization: `JWT ${token}` });
async function write(request: APIRequestContext, path: string, data: object, token = admin) {
  const response = await request.patch(`${cms}/api/${path}`, { headers: auth(token), data });
  expect(response.ok(), await response.text()).toBeTruthy();
  return (await response.json()).doc;
}
test.beforeAll(async ({ request }) => {
  admin = (await (await request.post(`${cms}/api/users/login`, { data: { email: 'admin@example.test', password }, timeout: 120000 })).json()).token;
  for (const role of ['editor', 'care-team']) {
    const existing = await request.get(`${cms}/api/users?where[email][equals]=workspace-${role}@example.test`, { headers: auth(admin) });
    const response = (await existing.json()).totalDocs ? existing : await request.post(`${cms}/api/users`, { headers: auth(admin), data: { name: `Synthetic ${role}`, email: `workspace-${role}@example.test`, password, role } });
    expect(response.ok(), await response.text()).toBeTruthy();
    const token = (await (await request.post(`${cms}/api/users/login`, { data: { email: `workspace-${role}@example.test`, password } })).json()).token;
    if (role === 'editor') editor = token; else care = token;
  }
  const requestResponse = await request.post(`${cms}/api/support-requests`, { headers: auth(admin), data: { kind: 'care', status: 'reviewed', name: 'Synthetic dashboard care request', email: 'dashboard@example.test', preferredContact: 'email', consent: true } });
  expect(requestResponse.ok(), await requestResponse.text()).toBeTruthy();
  const support = (await requestResponse.json()).doc;
  appointmentReference = support.reference;
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  for (const [offset, status] of [[0, 'confirmed'], [-86400000, 'confirmed'], [0, 'cancelled']] as const) {
    const start = new Date(new Date(`${day}T12:00:00+03:00`).getTime() + offset);
    const response = await request.post(`${cms}/api/appointments`, { headers: auth(admin), data: { request: support.id, startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3600000).toISOString(), location: 'Synthetic location', status } });
    expect(response.ok(), await response.text()).toBeTruthy();
  }
});

test('dashboard adapts to staff roles and fits a phone', async ({ page, context }) => {
  for (const [token, privateWork] of [[admin, true], [care, true], [editor, false]] as const) {
    await context.addCookies([{ name: 'payload-token', value: token, domain: '127.0.0.1', path: '/' }]);
    await page.goto(`${cms}/admin`);
    await expect(page.getByRole('heading', { name: /Welcome,/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit services', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Users', exact: true })).toHaveCount(token === admin ? 1 : 0);
    await expect(page.getByRole('heading', { name: 'Awaiting review' })).toHaveCount(privateWork ? 1 : 0);
    await expect(page.getByText('Pending payments', { exact: true })).toHaveCount(privateWork ? 1 : 0);
    if (privateWork) {
      await expect(page.locator('.staff-stat').filter({ hasText: "Today's confirmed appointments" }).locator('strong')).toHaveText('1');
      await expect(page.locator('.staff-panel').filter({ has: page.getByRole('heading', { name: "Today's appointments" }) }).getByRole('link', { name: new RegExp(appointmentReference) })).toHaveCount(1);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  }
});

test('drafts, native version restoration and public intake preserve publication boundaries', async ({ request, page, context }) => {
  const created = await request.post(`${cms}/api/services`, { headers: auth(editor), data: { title: 'Synthetic workspace service', slug: 'workspace-service', number: '91', summary: 'Synthetic public summary', audience: 'Synthetic audience', description: 'Original published text', _status: 'published' } });
  expect(created.ok(), await created.text()).toBeTruthy();
  const id = (await created.json()).doc.id;
  const versions = (await (await request.get(`${cms}/api/services/versions?where[parent][equals]=${id}`, { headers: auth(editor) })).json()).docs;
  await write(request, `services/${id}?draft=true`, { body: body('PRIVATE DRAFT WORDING'), _status: 'draft' }, editor);
  const publicResponse = await request.get(`${cms}/api/services/${id}`);
  expect(publicResponse.ok()).toBeTruthy();
  expect(JSON.stringify(await publicResponse.json())).not.toContain('PRIVATE DRAFT WORDING');
  const draftQuery = await request.get(`${cms}/api/services/${id}?draft=true`);
  expect(await draftQuery.text()).not.toContain('PRIVATE DRAFT WORDING');
  await context.addCookies([{ name: 'payload-token', value: editor, domain: '127.0.0.1', path: '/' }]);
  await page.goto(`/preview/services/${id}`);
  await expect(page.getByText(/Unpublished preview/)).toBeVisible();
  await expect(page.locator('.rich-content strong')).toContainText('PRIVATE DRAFT WORDING');
  await expect(page.locator('a[href^="/support"]')).toHaveCount(0);
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
  await write(request, `services/${id}`, { body: body('New published text'), _status: 'published' }, editor);
  const restored = await request.post(`${cms}/api/services/versions/${versions[0].id}`, { headers: auth(editor) });
  expect(restored.ok(), await restored.text()).toBeTruthy();
  expect((await restored.json())._status).toBe('draft');
  expect(await (await request.get(`${cms}/api/services/${id}`)).text()).not.toContain('Original published text');
  await write(request, `services/${id}`, { _status: 'draft' }, editor);
  const other = await request.post(`${cms}/api/services`, { headers: auth(editor), data: { title: 'Unpublished only', slug: 'workspace-private', number: '92', summary: 'Private draft', audience: 'Synthetic', description: 'Private only', _status: 'draft' } });
  const privateId = (await other.json()).doc.id;
  expect((await request.get(`${cms}/api/services/${privateId}`)).status()).toBeGreaterThanOrEqual(400);
  const intake = await request.post('/support', { form: { kind: 'care', name: 'Synthetic', preferredContact: 'email', email: 'test@example.test', service: 'workspace-private', consent: 'on' } });
  expect(intake.status()).toBe(400);
});

test('legacy writes and rich text remain compatible and unsafe content is rejected', async ({ request }) => {
  const service = (await (await request.get(`${cms}/api/services?limit=1`)).json()).docs[0];
  const saved = await write(request, `services/${service.id}`, { body: body('Synthetic bold paragraph'), _status: 'published' });
  expect(saved.description).toBe('Synthetic bold paragraph');
  const legacy = await write(request, `services/${service.id}`, { description: 'Synthetic legacy update' });
  expect(JSON.stringify(legacy.body)).toContain('Synthetic legacy update');
  const unsafe = body('unsafe');
  Object.assign(unsafe.root.children[0], { type: 'link', fields: { url: 'javascript:alert(1)' } });
  const response = await request.patch(`${cms}/api/services/${service.id}`, { headers: auth(editor), data: { body: unsafe } });
  expect(response.status()).toBe(400);
});

test('media validates uploads, serves durable files and prevents deletion of referenced assets', async ({ request, page }) => {
  const guestUpload = await request.post(`${cms}/api/media`, { multipart: { _payload: JSON.stringify({ title: 'Blocked guest asset', approvedForPublicUse: true }), file: { name: 'invalid.png', mimeType: 'image/png', buffer: Buffer.from('invalid') } } });
  expect(guestUpload.status()).toBe(403);
  const image = await sharp({ create: { width: 1000, height: 600, channels: 3, background: '#cfaf69' } }).png().toBuffer();
  async function upload(buffer: Buffer, mimeType: string, extra: object = {}) {
    return request.post(`${cms}/api/media`, { headers: auth(editor), multipart: { _payload: JSON.stringify({ title: 'Synthetic public asset', approvedForPublicUse: true, alt: 'Synthetic golden rectangle', ...extra }), file: { name: mimeType === 'application/pdf' ? 'synthetic.pdf' : 'synthetic.png', mimeType, buffer } } });
  }
  expect((await upload(Buffer.from('invalid-image'), 'image/png')).status()).toBe(400);
  expect((await upload(image, 'image/png', { alt: '' })).status()).toBe(400);
  expect((await upload(image, 'image/png', { approvedForPublicUse: false })).status()).toBe(400);
  const uploaded = await upload(image, 'image/png');
  expect(uploaded.ok(), await uploaded.text()).toBeTruthy();
  const media = (await uploaded.json()).doc;
  expect(media.sizes.detail.width).toBe(960);
  expect((await request.get(media.url)).ok()).toBeTruthy();
  await page.setContent('<p>Synthetic public document</p>');
  const pdf = await upload(await page.pdf(), 'application/pdf');
  expect(pdf.ok(), await pdf.text()).toBeTruthy();
  const document = (await pdf.json()).doc;
  const course = (await (await request.get(`${cms}/api/courses?limit=1`)).json()).docs[0];
  try {
  await write(request, `courses/${course.id}`, { image: media.id, downloads: [document.id], meta: { title: 'Synthetic search title', description: 'Synthetic search description', image: media.id }, _status: 'published' }, editor);
  await page.goto(`/training/${course.slug}`);
  await expect(page).toHaveTitle('Synthetic search title');
  await expect(page.getByAltText('Synthetic golden rectangle')).toBeVisible();
  await expect(page.getByRole('link', { name: /Synthetic public asset \(PDF/ })).toBeVisible();
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toContain('/api/media/file/');
  expect((await request.delete(`${cms}/api/media/${media.id}`, { headers: auth(editor) })).status()).toBe(403);
  expect((await request.delete(`${cms}/api/media/${media.id}`, { headers: auth(admin) })).status()).toBe(400);
  } finally {
    await write(request, `courses/${course.id}`, { image: null, downloads: [], meta: {}, _status: 'published' });
  }
});

test('anonymous visitors cannot open protected previews or version history', async ({ request }) => {
  const response = await request.get('/preview/services/1', { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect((await request.get('/preview/users/1')).status()).toBe(404);
  expect((await request.get(`${cms}/api/services/versions`)).status()).toBeGreaterThanOrEqual(400);
});

test('an editor can write in Lexical, autosave a draft and publish through the staff UI', async ({ request, page, context }) => {
  const response = await request.post(`${cms}/api/services`, { headers: auth(editor), data: { title: 'Synthetic browser editing', slug: 'workspace-browser-editing', number: '93', summary: 'Browser editing fixture', description: 'Starting text', audience: 'Synthetic', _status: 'draft' } });
  expect(response.ok(), await response.text()).toBeTruthy();
  const id = (await response.json()).doc.id;
  await context.addCookies([{ name: 'payload-token', value: editor, domain: '127.0.0.1', path: '/' }]);
  try {
    await page.goto(`${cms}/admin/collections/services/${id}`);
    const editorField = page.locator('[contenteditable="true"]').first();
    await editorField.click();
    await editorField.press('ControlOrMeta+a');
    await editorField.pressSequentially('Synthetic browser-authored content.');
    await page.getByRole('textbox', { name: /^Title/ }).click();
    await expect.poll(async () => JSON.stringify(await (await request.get(`${cms}/api/services/${id}?draft=true`, { headers: auth(editor) })).json()), { timeout: 20000 }).toContain('Synthetic browser-authored content.');
    expect((await request.get(`${cms}/api/services/${id}`)).status()).toBeGreaterThanOrEqual(400);
    await page.getByRole('button', { name: /^publish( changes)?$/i }).click();
    await expect.poll(async () => (await request.get(`${cms}/api/services/${id}`)).status()).toBe(200);
    await page.goto('/services/workspace-browser-editing');
    await expect(page.locator('.rich-content')).toContainText('Synthetic browser-authored content.');
  } finally {
    await fetch(`${cms}/api/services/${id}`, { method: 'PATCH', headers: { ...auth(admin), 'Content-Type': 'application/json' }, body: JSON.stringify({ _status: 'draft' }), signal: AbortSignal.timeout(5000) }).catch(() => undefined);
  }
});
