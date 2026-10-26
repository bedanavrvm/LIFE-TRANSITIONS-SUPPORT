import { test, expect } from '@playwright/test';

test('photographs and local fonts load, with readable homepage text', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const assetOrigins = new Set<string>();
  page.on('request', request => {
    if (['image', 'font'].includes(request.resourceType())) assetOrigins.add(new URL(request.url()).origin);
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family)))
    .toEqual(expect.arrayContaining(['DM Sans', 'Lora']));

  const photos = page.locator('main .care-photo');
  await expect(photos).toHaveCount(5);
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(photo).toHaveAttribute('alt', /\S+/);
  }
  expect([...assetOrigins]).toEqual([new URL(page.url()).origin]);
  const sizes = await page.locator('.hero-copy p, .situation p, .steps p, .course-body p').evaluateAll(elements =>
    elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
  expect(sizes.every(size => size >= 18)).toBe(true);
});

test('headings, leads, labels and helpers have distinct roles, without the global preview banner', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const path of ['/', '/services', '/support']) {
    await page.goto(path);
    await expect(page.locator('.preview-note')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    const heading = await page.locator('h1').evaluate(element => {
      const style = getComputedStyle(element);
      return { family: style.fontFamily, weight: style.fontWeight, size: parseFloat(style.fontSize) };
    });
    expect(heading.family).toContain('Lora');
    expect(heading.weight).toBe('500');
    expect(heading.size).toBeGreaterThanOrEqual(40);
  }
  const type = await page.evaluate(() => {
    const style = (selector: string) => getComputedStyle(document.querySelector(selector)!);
    return { body: parseFloat(style('body').fontSize), lead: parseFloat(style('.page-intro p').fontSize), labelWeight: style('label[for="name"]').fontWeight, helper: parseFloat(style('#message-help').fontSize), asideFamily: style('.form-aside h2').fontFamily };
  });
  expect(type.lead).toBeGreaterThan(type.body);
  expect(type.labelWeight).toBe('600');
  expect(type.helper).toBeGreaterThanOrEqual(15);
  expect(type.helper).toBeLessThan(type.body);
  expect(type.asideFamily).toContain('DM Sans');
  await expect(page.locator('.form-demo-note')).toContainText('fictional details');
});

for (const width of [320, 390, 768, 1440]) {
  test(`public pages remain readable and fit a ${width}px viewport`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/training', '/training/safe-baby-care', '/services/home-follow-up', '/support']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: innerWidth,
        bodyFont: parseFloat(getComputedStyle(document.body).fontSize),
      }));
      expect(layout.width, path).toBeLessThanOrEqual(layout.viewport);
      expect(layout.bodyFont, path).toBeGreaterThanOrEqual(18);
      if (path === '/support') {
        const labelSize = await page.getByLabel('Your name', { exact: true }).evaluate(input => {
          const label = document.querySelector(`label[for="${input.id}"]`)!;
          return parseFloat(getComputedStyle(label).fontSize);
        });
        expect(labelSize).toBeGreaterThanOrEqual(16);
      }
      if (path === '/' || width === 390 || width === 1440) {
        const name = path === '/' ? 'homepage' : path.replaceAll('/', '-').slice(1);
        await page.screenshot({ path: test.info().outputPath(`${name}-${width}.png`), fullPage: true });
      }
    }
  });
}

for (const width of [320, 390, 1440]) {
  test(`homepage and request form tolerate doubled text at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/support']) {
      await page.goto(path);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      if (path === '/support') {
        await page.getByLabel('Your name', { exact: true }).fill('Synthetic enlarged-text check');
        await expect(page.getByRole('button', { name: /Send my request/ })).toBeVisible();
      }
    }
  });
}

test('keyboard navigation and reduced-motion preference remain available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.hero .button').evaluate(button => getComputedStyle(button).transitionDuration)).toBe('0s');
});
