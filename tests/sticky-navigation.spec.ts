import { test, expect } from '@playwright/test';

async function moveTo(page: import('@playwright/test').Page, y: number) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test('pointer focus after closing the phone menu does not pin the smaller header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resources');
  expect(await page.locator('.header-shell').evaluate(element => element.getBoundingClientRect().height)).toBe(73);
  await page.locator('.mobile-nav summary').click();
  await page.locator('.mobile-nav summary').click();
  await page.mouse.wheel(0, 500);
  await expect(page.locator('.header-shell')).toHaveAttribute('data-hidden', 'true');
  await expect.poll(() => page.locator('.header-shell').evaluate(element => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1);
  await page.mouse.wheel(0, -60);
  await expect(page.locator('.header-shell')).toHaveAttribute('data-hidden', 'false');
  await page.setViewportSize({ width: 1440, height: 1000 });
  expect(await page.locator('.header-shell').evaluate(element => element.getBoundingClientRect().height)).toBe(76);
});

test('training-card photographs navigate on phones without depending on hover', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    for (const route of ['/', '/training']) {
      await page.goto(`http://127.0.0.1:4421${route}`);
      const card = page.locator('.course-card').first();
      const href = await card.locator('a').getAttribute('href');
      const photo = card.locator('img');
      await photo.scrollIntoViewIfNeeded();
      const box = await photo.boundingBox();
      await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await expect(page).toHaveURL(`http://127.0.0.1:4421${href}`);
    }
  } finally { await context.close(); }
});

for (const width of [390, 1440]) {
  test(`breadcrumbs and the section index stay visible and track reading at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/privacy');
    const toc = page.getByRole('navigation', { name: 'On this page' });
    for (const id of ['use', 'access', 'payments', 'first-message']) {
      const y = await page.locator(`#${id}`).evaluate(element => scrollY + element.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 2);
      await moveTo(page, y);
      await expect(toc.locator(`a[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
      await expect(toc.locator('a[aria-current]')).toHaveCount(1);
      await expect(toc).toBeInViewport();
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeInViewport();
      const gap = await page.evaluate(() => document.querySelector('.section-nav')!.getBoundingClientRect().top - document.querySelector('.breadcrumb-bar')!.getBoundingClientRect().bottom);
      expect(gap).toBeGreaterThanOrEqual(-1);
    }
    await toc.getByRole('link', { name: 'How it is used' }).click();
    await expect(page).toHaveURL(/#use$/);
    await expect(toc.locator('a[href="#use"]')).toHaveAttribute('aria-current', 'location');
    await expect.poll(async () => {
      const heading = await page.locator('#use').boundingBox();
      const breadcrumb = await page.locator('.breadcrumb-bar').boundingBox();
      const navigation = await toc.boundingBox();
      return heading!.y >= (width <= 1100 ? navigation!.y + navigation!.height : breadcrumb!.y + breadcrumb!.height) - 1;
    }).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`sticky-navigation-${width}.png`) });
  });

  test(`sticky breadcrumbs retain working parent navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/services/spiritual-bereavement');
    await moveTo(page, 500);
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs).toBeInViewport();
    await crumbs.getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
    await page.goto('/training/safe-baby-care');
    await moveTo(page, 500);
    await crumbs.getByRole('link', { name: 'Caregiver training', exact: true }).click();
    await expect(page).toHaveURL(/\/training$/);
  });
}

test('a short phone viewport and doubled text keep sticky reading controls within the screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/resources');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await moveTo(page, 700);
  const toc = page.getByRole('navigation', { name: 'On this page' });
  await expect(toc).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await toc.getByRole('link', { name: 'Ask about arrangements' }).click();
  await expect(toc.locator('a[href="#arrangements"]')).toHaveAttribute('aria-current', 'location');
});

test('breadcrumbs and the section links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4421/resources');
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Ask about arrangements' }).click();
    await expect(page).toHaveURL(/#arrangements$/);
    await expect(page.getByRole('navigation', { name: 'On this page' })).toBeInViewport();
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeInViewport();
    await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4421/');
  } finally { await context.close(); }
});
