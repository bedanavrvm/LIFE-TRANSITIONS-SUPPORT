import { test, expect, type APIRequestContext } from '@playwright/test';

const backend = 'http://127.0.0.1:3100';
const password = 'Synthetic-test-passphrase-2026';
const submission = { source: 'phone', kind: 'care', name: 'Synthetic inbox family', phone: '+254700000040', email: '', preferredContact: 'phone', service: 'home-follow-up', course: '', message: 'Synthetic original message', consent: true };
let admin: Record<string, string>, care: Record<string, string>, editor: Record<string, string>;
async function login(request: APIRequestContext, email: string) {
  const response = await request.post(backend + '/api/users/login', { data: { email, password } });
  expect(response.ok(), await response.text()).toBeTruthy();
  return { Authorization: 'JWT ' + (await response.json()).token };
}
async function capture(request: APIRequestContext, values = {}, headers = admin) {
  const response = await request.post(backend + '/api/request-workflow/capture', { headers, data: { ...submission, ...values } });
  expect(response.status(), await response.text()).toBe(201);
  return (await response.json()).doc;
}
async function history(request: APIRequestContext, id: number) {
  return (await (await request.get(backend + '/api/request-activity?depth=0&where[request][equals]=' + id, { headers: admin })).json()).docs;
}
test.beforeAll(async ({ request }) => {
  admin = await login(request, 'admin@example.test');
  for (const [role, email] of [['care-team', 'inbox-care@example.test'], ['editor', 'inbox-editor@example.test']]) {
    const existing = await (await request.get(backend + '/api/users?where[email][equals]=' + email, { headers: admin })).json();
    if (!existing.docs.length) {
      const response = await request.post(backend + '/api/users', { headers: admin, data: { name: 'Synthetic ' + role, email, password, role } });
      expect(response.ok(), await response.text()).toBeTruthy();
    }
  }
  care = await login(request, 'inbox-care@example.test');
  editor = await login(request, 'inbox-editor@example.test');
});
test('original submissions are protected for care staff and administrators through every API path', async ({ request }) => {
  const record = await capture(request);
  expect(record).toMatchObject({ status: 'new', source: 'phone', capturedByName: 'Test administrator' });
  for (const headers of [care, admin]) {
    for (const data of [{ name: 'Overwritten', phone: '+254700999999', email: 'other@example.test', preferredContact: 'email' }, { kind: 'callback', service: null, course: null, message: 'Replaced', consent: false }, { reference: 'LT-AAAAAAAA', source: 'website', capturedBy: null, workflowRevision: 'injected', staffNotes: 'Rewrite' }, { status: 'reviewed' }]) {
      expect((await request.patch(backend + '/api/support-requests/' + record.id, { headers, data })).status()).toBe(403);
    }
    expect((await request.post(backend + '/api/support-requests', { headers, data: submission })).status()).toBe(403);
    expect((await request.patch(backend + '/api/support-requests?where[id][equals]=' + record.id, { headers, data: { name: 'Bulk replacement' } })).status()).toBe(403);
  }
  const unchanged = await (await request.get(backend + '/api/support-requests/' + record.id + '?depth=0', { headers: admin })).json();
  expect(unchanged).toMatchObject({ name: record.name, phone: record.phone, message: record.message, reference: record.reference, status: 'new', workflowRevision: record.workflowRevision });
});
test('triage records atomic, attributed history and rejects stale or invalid changes', async ({ request }) => {
  const record = await capture(request);
  const url = backend + '/api/request-workflow/' + record.id + '/status';
  const reviewed = await request.post(url, { headers: care, data: { status: 'reviewed', revision: record.workflowRevision } });
  expect(reviewed.status(), await reviewed.text()).toBe(200);
  const current = (await reviewed.json()).doc;
  expect(current.workflowRevision).not.toBe(record.workflowRevision);
  expect((await request.post(url, { headers: admin, data: { status: 'closed', revision: record.workflowRevision, reason: 'Stale change' } })).status()).toBe(409);
  expect((await request.post(url, { headers: admin, data: { status: 'closed', revision: current.workflowRevision, reason: '' } })).status()).toBe(400);
  expect((await history(request, record.id))).toHaveLength(1);
  const closed = await request.post(url, { headers: admin, data: { status: 'closed', revision: current.workflowRevision, reason: 'Family confirmed no further follow-up needed.' } });
  expect(closed.status(), await closed.text()).toBe(200);
  const reopened = await request.post(url, { headers: care, data: { status: 'reviewed', revision: (await closed.json()).doc.workflowRevision } });
  expect(reopened.status()).toBe(200);
  expect(await history(request, record.id)).toHaveLength(3);
  expect((await history(request, record.id)).some((entry: any) => entry.authorName === 'Synthetic care-team' && entry.fromStatus === 'new' && entry.toStatus === 'reviewed')).toBeTruthy();
});
test('notes are append-only, concurrent additions survive and author spoofing is rejected', async ({ request }) => {
  const record = await capture(request);
  const url = backend + '/api/request-workflow/' + record.id + '/note';
  const results = await Promise.all(['First correction note', 'Second follow-up note'].map(text => request.post(url, { headers: care, data: { text } })));
  for (const result of results) expect(result.status(), await result.text()).toBe(201);
  const entries = await history(request, record.id);
  expect(entries).toHaveLength(2);
  expect((await request.post(url, { headers: care, data: { text: 'Impersonation', author: 1 } })).status()).toBe(400);
  for (const headers of [admin, care]) {
    expect((await request.patch(backend + '/api/request-activity/' + entries[0].id, { headers, data: { text: 'Replacement' } })).status()).toBe(403);
    expect((await request.delete(backend + '/api/request-activity/' + entries[0].id, { headers })).status()).toBe(403);
    expect((await request.post(backend + '/api/request-activity', { headers, data: { request: record.id, kind: 'note', text: 'Bypass', author: 1, authorName: 'Pretend' } })).status()).toBe(403);
  }
});
test('concurrent status actions admit one change and preserve one truthful history entry', async ({ request }) => {
  const record = await capture(request);
  const url = backend + '/api/request-workflow/' + record.id + '/status';
  const results = await Promise.all([
    request.post(url, { headers: admin, data: { status: 'reviewed', revision: record.workflowRevision } }),
    request.post(url, { headers: care, data: { status: 'closed', revision: record.workflowRevision, reason: 'Concurrent closure' } }),
  ]);
  expect(results.map(response => response.status()).sort()).toEqual([200, 409]);
  const entries = await history(request, record.id);
  expect(entries).toHaveLength(1);
  const saved = await (await request.get(backend + '/api/support-requests/' + record.id, { headers: admin })).json();
  expect(saved.status).toBe(entries[0].toStatus);
});
test('capture validates source and contacts; linked follow-up preserves original and links both timelines', async ({ request }) => {
  const original = await capture(request, { source: 'whatsapp' }, care);
  expect(original).toMatchObject({ source: 'whatsapp', capturedByName: 'Synthetic care-team' });
  const followup = await capture(request, { source: 'staff-follow-up', originalRequest: original.id, note: 'The family requested different support.', service: 'spiritual-bereavement' }, care);
  expect(Number(followup.originalRequest?.id || followup.originalRequest)).toBe(original.id);
  expect(await history(request, original.id)).toHaveLength(1);
  expect(await history(request, followup.id)).toHaveLength(1);
  for (const values of [{ source: 'website' }, { phone: '' }, { capturedBy: 1 }, { status: 'reviewed' }, { source: 'staff-follow-up' }, { source: 'staff-follow-up', originalRequest: 9999999, note: 'Missing parent' }]) {
    expect((await request.post(backend + '/api/request-workflow/capture', { headers: care, data: { ...submission, ...values } })).status()).toBeGreaterThanOrEqual(400);
  }
  expect((await request.post(backend + '/api/request-workflow/' + original.id + '/note', { headers: { ...care, Origin: 'https://untrusted.example' }, data: { text: 'Cross-origin' } })).status()).toBe(403);
});
test('editors and anonymous visitors cannot use the workspace data or command endpoints', async ({ request }) => {
  const record = await capture(request);
  for (const headers of [{}, editor]) {
    for (const path of ['support-requests', 'request-activity']) expect((await request.get(backend + '/api/' + path, { headers })).status()).toBeGreaterThanOrEqual(400);
    for (const path of ['capture', record.id + '/note', record.id + '/status']) expect((await request.post(backend + '/api/request-workflow/' + path, { headers, data: submission })).status()).toBe(403);
  }
});
test('catalogue deletion cannot clear the original requested service or training', async ({ request }) => {
  for (const [collection, field] of [['services', 'service'], ['courses', 'course']]) {
    const slug = 'inbox-preserved-' + collection;
    const content = await request.post(backend + '/api/' + collection, { headers: admin, data: { title: 'Synthetic retained ' + collection, slug, number: '98', audience: 'Synthetic', summary: 'Synthetic', description: 'Synthetic', details: 'Synthetic', _status: 'published' } });
    expect(content.ok(), await content.text()).toBeTruthy();
    const item = (await content.json()).doc;
    const record = await capture(request, { [field]: slug });
    expect((await request.delete(backend + '/api/' + collection + '/' + item.id, { headers: admin })).status()).toBe(400);
    const saved = await (await request.get(backend + '/api/support-requests/' + record.id + '?depth=0', { headers: admin })).json();
    expect(saved[field]).toBe(item.id);
    const unused = await request.post(backend + '/api/' + collection, { headers: admin, data: { title: 'Synthetic unused ' + collection, slug: slug + '-unused', number: '99', audience: 'Synthetic', summary: 'Synthetic', description: 'Synthetic', details: 'Synthetic', _status: 'draft' } });
    expect(unused.ok(), await unused.text()).toBeTruthy();
    expect((await request.delete(backend + '/api/' + collection + '/' + (await unused.json()).doc.id, { headers: admin })).ok()).toBeTruthy();
  }
});
test('staff can triage, capture and read history in the dedicated inbox on desktop and phone', async ({ page, request, context }) => {
  test.setTimeout(120000);
  const record = await capture(request, { name: 'Synthetic UI inbox visitor' });
  await context.addCookies([{ name: 'payload-token', value: care.Authorization.slice(4), domain: '127.0.0.1', path: '/' }]);
  await page.goto(backend + '/admin/requests?q=Synthetic%20UI%20inbox%20visitor');
  await expect(page.getByRole('heading', { name: 'Request inbox' })).toBeVisible();
  await page.getByRole('link', { name: record.reference, exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Original request' })).toBeVisible();
  await expect(page.getByText('Synthetic UI inbox visitor', { exact: true })).toBeVisible();
  await expect(page.locator('input[name=name]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mark reviewed', exact: true }).click();
  await expect(page.getByText('Request reviewed.', { exact: true })).toBeVisible();
  await page.getByLabel('Add a follow-up note', { exact: true }).fill('Synthetic correction: the family supplied an updated contact.');
  await page.getByRole('button', { name: 'Add note', exact: true }).click();
  await expect(page.getByText('Synthetic correction: the family supplied an updated contact.', { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Original request' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.goto(backend + '/admin/requests/new');
  await page.getByLabel('Name', { exact: true }).fill('Synthetic captured from inbox');
  await page.getByLabel('Contact phone', { exact: true }).fill('+254700000041');
  await page.getByLabel('Privacy information was communicated and acknowledgement received.').check();
  await page.getByRole('button', { name: 'Save enquiry', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Original request' })).toBeVisible();
  await expect(page.getByText('Synthetic captured from inbox', { exact: true })).toBeVisible();
});

test('inbox filters and pagination work without contact previews and editor screens stay restricted', async ({ page, context, request }) => {
  test.setTimeout(120000);
  for (let index = 0; index < 21; index++) await capture(request, { name: 'Synthetic pagination family ' + index, kind: 'callback' });
  await context.addCookies([{ name: 'payload-token', value: care.Authorization.slice(4), domain: '127.0.0.1', path: '/' }]);
  await page.goto(backend + '/admin/requests?q=Synthetic%20pagination%20family&kind=callback');
  await expect(page.locator('tbody tr')).toHaveCount(20);
  await expect(page.locator('table')).not.toContainText(submission.phone);
  await expect(page.locator('table')).not.toContainText(submission.message);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Closed', exact: true }).click();
  await expect(page.getByText('No requests match these filters.', { exact: true })).toBeVisible();
  await context.addCookies([{ name: 'payload-token', value: editor.Authorization.slice(4), domain: '127.0.0.1', path: '/' }]);
  await page.goto(backend + '/admin/requests');
  await expect(page.getByRole('heading', { name: 'Access restricted' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Request inbox' })).toHaveCount(0);
});
