import { test, expect, type Page } from '@playwright/test';

async function scrollTo(page: Page, y: number) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test('header hides downwards, ignores small reversals and returns upwards or on focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/resources');
  const header = page.locator('.header-shell');
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await scrollTo(page, 300);
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await expect.poll(() => header.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1);
  await scrollTo(page, 290);
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await scrollTo(page, 270);
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await scrollTo(page, 286);
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await scrollTo(page, 295);
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await header.getByRole('link', { name: 'Services', exact: true }).focus();
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await expect.poll(() => header.evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
  await scrollTo(page, 0);
  await expect(header).toHaveAttribute('data-hidden', 'false');
});

test('an open phone menu stays visible while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resources');
  await page.locator('.mobile-nav summary').click();
  await scrollTo(page, 400);
  await expect(page.locator('.header-shell')).toHaveAttribute('data-hidden', 'false');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Request support' })).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('none');
});

test('homepage has gentle desktop snapping and bounded photo depth, while articles scroll freely', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('y');
  await expect(page.locator('.chapter')).toHaveCount(6);
  if (await page.evaluate(() => CSS.supports('animation-timeline: view()'))) {
    const first = await page.locator('.hero-art').evaluate(el => parseFloat(getComputedStyle(el).translate.split(' ')[1]));
    await scrollTo(page, 550);
    await expect.poll(() => page.locator('.hero-art').evaluate(el => parseFloat(getComputedStyle(el).translate.split(' ')[1]))).not.toBe(first);
    const movement = await page.locator('.hero-art').evaluate(el => parseFloat(getComputedStyle(el).translate.split(' ')[1]));
    expect(Math.abs(movement)).toBeLessThanOrEqual(12);
  }
  await page.locator('.steps li').last().scrollIntoViewIfNeeded();
  await expect(page.locator('.steps li').last()).toBeInViewport();
  await page.keyboard.press('End');
  await expect(page.getByRole('link', { name: 'Privacy & your information' })).toBeInViewport();
  await page.goto('/privacy');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('none');
});

test('reduced motion keeps directional navigation without animation and disables snapping and parallax', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await scrollTo(page, 600);
  await expect(page.locator('.header-shell')).toHaveAttribute('data-hidden', 'true');
  expect(await page.locator('.header-shell').evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await scrollTo(page, 560);
  await expect(page.locator('.header-shell')).toHaveAttribute('data-hidden', 'false');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('none');
  expect(await page.locator('.hero-art').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  const item = page.locator('.situation').first();
  await item.hover();
  expect(await item.evaluate(el => getComputedStyle(el).transform)).toBe('none');
});

test('navigation and article content work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4421/resources');
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    expect(await page.locator('.header-shell').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(0);
    await page.locator('.mobile-nav summary').click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.locator('.service-card')).toHaveCount(10);
  } finally { await context.close(); }
});

test('article anchors clear the sticky header and hover feedback has a keyboard equivalent', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/privacy');
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Payments and contact' }).click();
  await expect(page).toHaveURL(/#payments$/);
  await expect.poll(() => page.locator('#payments').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThan(110);
  await page.goto('/');
  const item = page.locator('.situation').first();
  await item.hover();
  await expect.poll(() => item.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  expect(await item.evaluate(el => getComputedStyle(el).boxShadow)).not.toBe('none');
  await item.focus();
  expect(await item.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  const colours = await page.locator('.chapter').evaluateAll(elements => elements.map(el => getComputedStyle(el).backgroundColor));
  expect(new Set(colours).size).toBeGreaterThanOrEqual(5);
  expect(await page.locator('.site-footer').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(25, 24, 21)');
});

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`article layouts, side panels and doubled text fit ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/about', '/privacy', '/resources', '/contact', '/services/home-follow-up', '/training/safe-baby-care']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      if (width >= 1440) {
        expect(await page.locator('.content-columns').evaluate(el => el.getBoundingClientRect().width)).toBe(1280);
        expect(await page.locator('.intro-band').evaluate(el => el.getBoundingClientRect().width)).toBe(width);
        const columns = await page.locator('.content-columns').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' '));
        expect(columns).toHaveLength(2);
      }
      if (width === 390 || width === 1440 || width === 1920) {
        await page.screenshot({ path: test.info().outputPath(`${route.replaceAll('/', '-').slice(1)}-${width}.png`), fullPage: true });
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} doubled text`).toBe(true);
    }
  });
}
