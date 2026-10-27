import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`training controls reach both ends without moving focus or the page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const carousel = page.getByRole('region', { name: 'Better prepared. Better supported.' });
    const track = carousel.locator('.course-track');
    const previous = carousel.getByRole('button', { name: 'Previous training' });
    const next = carousel.getByRole('button', { name: 'Next training' });
    await expect(track.locator('.course-card')).toHaveCount(3);
    await expect(previous).toHaveAttribute('aria-disabled', 'true');
    await expect(next).toHaveAttribute('aria-disabled', 'false');
    await next.focus();
    const y = await page.evaluate(() => scrollY);
    for (let step = 0; step < 3 && await next.getAttribute('aria-disabled') !== 'true'; step++) {
      const before = await track.evaluate(element => element.scrollLeft);
      const range = await carousel.getByRole('status').textContent();
      await page.keyboard.press('Enter');
      await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(before);
      await expect(next).toBeFocused();
      await expect(carousel.getByRole('status')).not.toHaveText(range!);
    }
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    const end = await track.evaluate(element => element.scrollLeft);
    await page.keyboard.press('Enter');
    expect(await track.evaluate(element => element.scrollLeft)).toBe(end);
    expect(Math.abs(await page.evaluate(() => scrollY) - y)).toBeLessThanOrEqual(1);
    await previous.focus();
    for (let step = 0; step < 3 && await previous.getAttribute('aria-disabled') !== 'true'; step++) {
      const before = await track.evaluate(element => element.scrollLeft);
      const range = await carousel.getByRole('status').textContent();
      await previous.press('Space');
      await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeLessThan(before);
      await expect(previous).toBeFocused();
      await expect(carousel.getByRole('status')).not.toHaveText(range!);
    }
    await expect(previous).toHaveAttribute('aria-disabled', 'true');
    await expect(carousel.getByRole('status')).toContainText(width === 390 ? 'Course 1 of 3' : 'Courses 1–2 of 3');
    const first = track.locator('.course-card').first();
    const destination = await first.getByRole('link').getAttribute('href');
    const photo = first.locator('.course-art');
    await photo.scrollIntoViewIfNeeded();
    const bounds = await photo.boundingBox();
    await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
    await expect(page).toHaveURL(`http://127.0.0.1:4421${destination}`);
  });
}

test('native scrolling and resizing keep the range and controls accurate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const track = page.locator('.course-track');
  await track.evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
  await expect(page.locator('.carousel-status')).toHaveText('Course 3 of 3');
  await expect(page.getByRole('button', { name: 'Next training' })).toHaveAttribute('aria-disabled', 'true');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('.carousel-status')).toHaveText('Courses 2–3 of 3');
  const css = await page.addStyleTag({ content: '.course-track { grid-auto-columns: calc((100% - 64px) / 3); }' });
  await expect(page.locator('.carousel-controls')).toBeHidden();
  await css.evaluate(element => element.remove());
  await expect(page.locator('.carousel-controls')).toBeVisible();
});

for (const count of [0, 1]) {
  test(`a ${count}-course response has no unusable carousel controls`, async ({ page }) => {
    await page.route('http://127.0.0.1:4421/', async route => {
      const response = await route.fetch();
      let index = 0;
      const body = (await response.text()).replace(/<article class="course-card"[^>]*>[\s\S]*?<\/article>/g, card => index++ < count ? card : '');
      await route.fulfill({ response, body });
    });
    await page.goto('/');
    await expect(page.locator('.course-track .course-card')).toHaveCount(count);
    await expect(page.locator('.carousel-controls')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('without JavaScript the carousel scrolls and its whole-card links still work', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4421/');
    await expect(page.locator('.carousel-controls')).toBeHidden();
    const track = page.locator('.course-track');
    await track.evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
    const last = track.locator('.course-card').last();
    const destination = await last.getByRole('link').getAttribute('href');
    const photo = last.locator('.course-art');
    await photo.scrollIntoViewIfNeeded();
    const bounds = await photo.boundingBox();
    await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
    await expect(page).toHaveURL(`http://127.0.0.1:4421${destination}`);
  } finally { await context.close(); }
});
