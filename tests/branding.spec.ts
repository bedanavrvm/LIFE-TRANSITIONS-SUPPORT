import { test, expect } from '@playwright/test';

function contrast(foreground: string, background: string) {
  const luminance = (colour: string) => {
    const channels = colour.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => value / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

test('official assets and tagline replace the temporary brand without distorting the full logo', async ({ page, request }) => {
  const fullLogo = await request.get('/brand/official-logo.jpeg');
  const emblem = await (await request.get('/mark.svg')).text();
  const embedded = emblem.match(/base64,([^"\s]+)/)![1];
  expect(Buffer.from(embedded, 'base64').equals(await fullLogo.body())).toBe(true);
  await page.goto('/');
  await expect(page.locator('.brand-tagline')).toHaveText('Walking life’s seasons with you.');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#191815');
  expect(await page.locator('.brand-mark').evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  await page.goto('/about');
  await expect(page.locator('.article-copy')).toContainText("No one should navigate life's transitions alone.");
  for (const logo of await page.locator('.official-brand-panel img').all()) {
    await logo.scrollIntoViewIfNeeded();
    await expect.poll(() => logo.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 1599)).toBe(true);
    const size = await logo.boundingBox();
    expect(Math.abs(size!.width / size!.height - 1599 / 1066)).toBeLessThan(.01);
    await expect(logo).toHaveAttribute('alt', /Walking life’s seasons with you/);
  }
});

test('rendered brand text, button states and form boundaries retain sufficient contrast', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['.header-shell', '.hero-copy .brand-tagline', '.site-footer']) {
    const colours = await page.locator(selector).evaluate(element => {
      let background = element;
      while (getComputedStyle(background).backgroundColor === 'rgba(0, 0, 0, 0)' && background.parentElement) background = background.parentElement;
      return [getComputedStyle(element).color, getComputedStyle(background).backgroundColor];
    });
    expect(contrast(...colours as [string, string]), selector).toBeGreaterThanOrEqual(4.5);
  }
  for (const selector of ['.hero .button', '.header-cta']) {
    const button = page.locator(selector);
    for (const state of ['rest', 'hover', 'focus']) {
      if (state === 'hover') await button.hover();
      if (state === 'focus') await button.focus();
      const colours = await button.evaluate(element => [getComputedStyle(element).color, getComputedStyle(element).backgroundColor]);
      expect(contrast(...colours as [string, string]), `${selector} ${state}`).toBeGreaterThanOrEqual(4.5);
    }
  }
  await page.goto('/support');
  const field = await page.locator('#name').evaluate(element => [getComputedStyle(element).borderTopColor, getComputedStyle(element).backgroundColor]);
  expect(contrast(...field as [string, string])).toBeGreaterThanOrEqual(3);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-nav summary').click();
  await page.locator('.mobile-support').focus();
  const colours = await page.locator('.mobile-support').evaluate(element => [getComputedStyle(element).color, getComputedStyle(element).backgroundColor]);
  expect(contrast(...colours as [string, string])).toBeGreaterThanOrEqual(4.5);
});

test('floral decoration stays outside interactions and disappears from narrow gutters', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/');
  const decoration = await page.locator('.introduction').evaluate(element => {
    const style = getComputedStyle(element, '::before');
    return { image: style.backgroundImage, pointer: style.pointerEvents, width: parseFloat(style.width), animation: style.animationName };
  });
  expect(decoration.image).toContain('/brand/floral-corner.svg');
  expect(decoration.pointer).toBe('none');
  expect(decoration.width).toBeGreaterThan(0);
  expect(decoration.animation).toBe('none');
  await expect(page.locator('.chapter-flourish')).toHaveAttribute('aria-hidden', 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator('.introduction').evaluate(element => getComputedStyle(element, '::before').display)).toBe('none');
  await expect(page.locator('.chapter-flourish')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('services and signature packages are separate and all new pages retain their enquiry context without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4421/services');
    await expect(page.locator('#family-support .service-card')).toHaveCount(7);
    await expect(page.locator('#signature-packages .service-card')).toHaveCount(3);
    for (const [slug, title] of [['community-support', 'Community support & home visits'], ['sacred-therapy', 'Sacred Therapy'], ['heart-to-heart-therapy', 'Heart to Heart Therapy'], ['letters-of-hope', 'Letters of Hope']]) {
      await page.goto(`http://127.0.0.1:4421/services/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await page.getByRole('link', { name: 'Request this support' }).click();
      await expect(page.locator('[data-service-context]')).toHaveText(title);
      await expect(page.locator('[name="service"]')).toHaveValue(slug);
    }
    await page.getByLabel('Your name', { exact: true }).fill('Synthetic package enquiry');
    await page.getByLabel('Contact phone number').fill('+254700000011');
    await page.locator('#consent').check();
    await page.getByRole('button', { name: /Send my request/ }).click();
    await expect(page).toHaveURL(/\/thanks\?reference=LT-/);
  } finally { await context.close(); }
});

test('an editor can regroup a package and its contextual enquiry remains linked to the same record', async ({ page, request }) => {
  const backend = 'http://127.0.0.1:3100';
  const login = await request.post(`${backend}/api/users/login`, { data: { email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026' }, timeout: 120000 });
  expect(login.ok()).toBeTruthy();
  const adminHeaders = { Authorization: `JWT ${(await login.json()).token}` };
  const editor = await request.post(`${backend}/api/users`, { headers: adminHeaders, data: { name: 'Synthetic brand editor', email: 'brand-editor@example.test', password: 'Synthetic-editor-passphrase-2026', role: 'editor' } });
  expect(editor.ok()).toBeTruthy();
  const editorID = (await editor.json()).doc.id;
  const original = (await (await request.get(`${backend}/api/services?where[slug][equals]=letters-of-hope`)).json()).docs[0];
  try {
    const editorLogin = await request.post(`${backend}/api/users/login`, { data: { email: 'brand-editor@example.test', password: 'Synthetic-editor-passphrase-2026' } });
    expect(editorLogin.ok()).toBeTruthy();
    const headers = { Authorization: `JWT ${(await editorLogin.json()).token}` };
    expect((await request.patch(`${backend}/api/services/${original.id}`, { headers, data: { category: 'service' } })).ok()).toBeTruthy();
    await page.goto('/services');
    await expect(page.locator('#family-support').getByRole('link', { name: 'Explore Letters of Hope', exact: true })).toBeVisible();
    await expect(page.locator('#signature-packages .service-card')).toHaveCount(2);
    expect((await request.get(`${backend}/api/support-requests`, { headers })).status()).toBe(403);
    await page.goto('/support?service=letters-of-hope');
    await expect(page.locator('[data-service-context]')).toHaveText('Letters of Hope');
  } finally {
    expect((await request.patch(`${backend}/api/services/${original.id}`, { headers: adminHeaders, data: { category: original.category } })).ok()).toBeTruthy();
    expect((await request.delete(`${backend}/api/users/${editorID}`, { headers: adminHeaders })).ok()).toBeTruthy();
  }
});
