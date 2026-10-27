import { test, expect } from '@playwright/test';
import { getServicePresentation } from '../apps/web/src/lib/servicePresentation';

const backend = 'http://127.0.0.1:3100';

test('unmapped service names have a neutral presentation, including object-property names', () => {
  for (const slug of ['a-new-service', 'constructor', 'toString', '__proto__']) {
    expect(getServicePresentation(slug)).toEqual({ icon: 'hands', tone: 'sage', photo: 'companionship' });
  }
});

test('all six service pages show the agreed visual, current content and a contextual request action', async ({ page, request }) => {
  const services = (await (await request.get(`${backend}/api/services?limit=20&sort=number`)).json()).docs;
  expect(services).toHaveLength(6);
  await page.goto('/services');
  await expect(page.locator('.service-card')).toHaveCount(6);
  await expect(page.locator('.service-card .badge')).toHaveCount(1);
  for (const service of services) {
    await page.goto('/services');
    const link = page.getByRole('link', { name: `Explore ${service.title}`, exact: true });
    await expect(link).toHaveAttribute('href', `/services/${service.slug}`);
    await link.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(service.title);
    await expect(page.locator('.service-facts')).toContainText(service.audience);
    await expect(page.locator('.article-copy')).toContainText(service.description);
    await expect(page.getByRole('link', { name: 'Request this support' })).toHaveAttribute('href', `/support?service=${service.slug}`);
    await expect(page.locator('.service-next li')).toHaveCount(3);
    const image = page.locator('.service-visual img');
    await expect(image).toHaveAttribute('alt', /\S+/);
    await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveAttribute('loading', 'eager');
    await expect(page.locator('.service-illustration')).toHaveCount(0);
    await expect(page.locator('.service-facts .badge')).toHaveCount(service.free ? 1 : 0);
    if (service.free) await expect(page.locator('.article-copy')).toContainText('family therapy and counselling');
  }
  expect((await request.get('/services/not-a-service')).status()).toBe(404);
});

test('package icons are decorative and each whole service card has one keyboard target', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.situation .icon .care-icon')).toHaveCount(6);
  await expect(page.locator('.trust-strip .care-icon')).toHaveCount(4);
  for (const icon of await page.locator('main .care-icon').all()) {
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveAttribute('focusable', 'false');
  }
  await page.goto('/services');
  for (const card of await page.locator('.service-card').all()) await expect(card.locator('a')).toHaveCount(1);
  const card = page.locator('.service-card').first();
  const link = card.getByRole('link');
  const restingShadow = await card.evaluate(element => getComputedStyle(element).boxShadow);
  await link.focus();
  expect(await link.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
  await expect.poll(() => card.evaluate(element => getComputedStyle(element).boxShadow)).not.toBe(restingShadow);
  await page.locator('h1').click();
  await card.hover();
  await expect.poll(() => card.evaluate(element => getComputedStyle(element).boxShadow)).not.toBe(restingShadow);
  await card.locator('.service-medallion').click();
  await expect(page).toHaveURL(/\/services\/psychological-support$/);
});

test('editor ordering and a new service keep slug-based visuals and use the neutral fallback', async ({ page, request }) => {
  const login = await request.post(`${backend}/api/users/login`, { data: { email: 'admin@example.test', password: 'Synthetic-test-passphrase-2026' }, timeout: 120000 });
  expect(login.ok()).toBeTruthy();
  const headers = { Authorization: `JWT ${(await login.json()).token}` };
  const original = (await (await request.get(`${backend}/api/services?where[slug][equals]=home-follow-up`)).json()).docs[0];
  let createdID: number | undefined;
  try {
    const changed = await request.patch(`${backend}/api/services/${original.id}`, { headers, data: { number: '00' } });
    expect(changed.ok()).toBeTruthy();
    const created = await request.post(`${backend}/api/services`, { headers, data: { title: 'Synthetic additional support', slug: 'synthetic-additional-support', number: '99', summary: 'Fictional service for the isolated test database.', description: 'Synthetic description.', audience: 'Synthetic families', free: false } });
    expect(created.ok(), await created.text()).toBeTruthy();
    createdID = (await created.json()).doc.id;
    await page.goto('/services');
    await expect(page.locator('.service-card').first().locator('.service-medallion [data-icon]')).toHaveAttribute('data-icon', 'home');
    await page.goto('/services/home-follow-up');
    await expect(page.locator('.service-visual')).toHaveAttribute('data-visual', 'photo');
    await page.goto('/services/synthetic-additional-support');
    await expect(page.locator('.service-visual')).toHaveAttribute('data-visual', 'photo');
    await expect(page.getByRole('link', { name: 'Request this support' })).toHaveAttribute('href', '/support?service=synthetic-additional-support');
  } finally {
    expect((await request.patch(`${backend}/api/services/${original.id}`, { headers, data: { number: original.number } })).ok()).toBeTruthy();
    if (createdID) expect((await request.delete(`${backend}/api/services/${createdID}`, { headers })).ok()).toBeTruthy();
  }
});

test('desktop and phone navigation identify exact pages and containing sections', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, href, current] of [['/services', '/services', 'page'], ['/services/home-follow-up', '/services', 'location'], ['/training/safe-baby-care', '/training', 'location'], ['/resources', '/resources', 'page']]) {
      await page.goto(route);
      if (width === 390) await page.locator('.mobile-nav summary').click();
      const nav = page.getByRole('navigation', { name: width === 390 ? 'Mobile navigation' : 'Main navigation', exact: true });
      await expect(nav.locator(`a[href="${href}"]`)).toHaveAttribute('aria-current', current);
      await expect(nav.locator('a[aria-current]')).toHaveCount(1);
    }
    await page.goto('/services-extra');
    await expect(page.locator('.desktop-nav a[aria-current], .mobile-nav a[aria-current]')).toHaveCount(0);
  }
});

test('phone menu supports keyboard use, dismissal, resizing and restored navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resources');
  const menu = page.locator('.mobile-nav');
  const toggle = menu.locator('summary');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Request support' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Space');
  await page.locator('main').focus();
  await expect(menu).not.toHaveAttribute('open', '');
  await toggle.click();
  await page.mouse.click(5, 150);
  await expect(menu).not.toHaveAttribute('open', '');
  await toggle.click();
  await page.setViewportSize({ width: 1101, height: 844 });
  await expect(menu).not.toHaveAttribute('open', '');
  await page.setViewportSize({ width: 390, height: 844 });
  await toggle.click();
  await menu.getByRole('link', { name: 'Our approach' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(menu).not.toHaveAttribute('open', '');
});

test('a short phone viewport with doubled text keeps menu links reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/services');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.locator('.mobile-nav summary').click();
  const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
  const bounds = await nav.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  await expect(nav.getByRole('link', { name: 'Request support' })).toBeInViewport();
  await nav.getByRole('link', { name: 'Contact', exact: true }).focus();
  await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const width of [320, 390, 768, 1100, 1101, 1440, 1920]) {
  test(`service layouts and the menu fit ${width}px with normal and doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/services', '/services/home-follow-up', '/services/spiritual-bereavement']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      if (route !== '/services') {
        const columns = await page.locator('.service-hero').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
        expect(columns).toBe(width > 1100 ? 2 : 1);
        if (width <= 1100) {
          const action = await page.getByRole('link', { name: 'Request this support' }).boundingBox();
          const visual = await page.locator('.service-visual').boundingBox();
          expect(action!.y + action!.height).toBeLessThanOrEqual(visual!.y);
        }
      }
      if ([390, 1440].includes(width)) await page.screenshot({ path: test.info().outputPath(`${route.replaceAll('/', '-')}-${width}.png`), fullPage: true });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} doubled text`).toBe(true);
    }
    if (width <= 1100) {
      await page.goto('/services');
      await page.locator('.mobile-nav summary').click();
      const links = page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link');
      const bounds = await page.getByRole('navigation', { name: 'Mobile navigation' }).boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await expect(links.first()).toHaveText('Request support');
      for (const link of await links.all()) expect(await link.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48);
      if (width === 390) await page.screenshot({ path: test.info().outputPath('open-phone-menu.png') });
    }
  });
}
