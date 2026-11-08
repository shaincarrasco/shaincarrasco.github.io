import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const projects = fs.readdirSync('src/content/projects').map((f) => f.replace(/\.mdx$/, ''));
const pages = ['/', '/projects/', '/research/', '/now/', '/about/', '/tools/', ...projects.map((p) => `/projects/${p}/`)];
const shotPages = new Set(['/', '/projects/', '/research/', '/now/', '/about/', '/tools/', '/projects/climb-intel/', '/projects/skai-metrics/', '/projects/lipread/']);

for (const p of pages) {
  test(`${p}: renders, links resolve, metadata complete, accessible`, async ({ page }, info) => {
    const res = await page.goto(p);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);

    // Metadata
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/^https:\/\/shaincarrasco\.github\.io\//);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toMatch(/\/og\/.+\.png$/);
    const ogRes = await page.request.get(new URL(og!).pathname);
    expect(ogRes.status(), `og image ${og}`).toBe(200);
    for (const s of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(s)).not.toThrow();

    // Every image has alt text and loads
    for (const img of await page.locator('img').all()) {
      expect(await img.getAttribute('alt'), 'img alt').not.toBeNull();
      const src = await img.getAttribute('src');
      if (src?.startsWith('/')) expect((await page.request.get(src)).status(), src).toBe(200);
    }

    // Internal links resolve
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
    for (const h of new Set(hrefs)) {
      if (h.startsWith('/#')) continue;
      // Page links end in a slash so GitHub Pages serves them without a redirect.
      if (!/\.[a-z0-9]+$/i.test(h.split(/[?#]/)[0])) expect(h.split(/[?#]/)[0], `link ${h} on ${p} needs a trailing slash`).toMatch(/\/$/);
      expect((await page.request.get(h)).status(), `${h} from ${p}`).toBe(200);
    }

    // Accessibility: no serious or critical WCAG 2.1 AA violations
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('video').analyze();
    const bad = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);

    // No horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'horizontal overflow px').toBeLessThanOrEqual(1);

    if (shotPages.has(p)) {
      const dir = path.join('screenshots', info.project.name);
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, `${p === '/' ? 'home' : p.slice(1).replace(/\/$/, '').replace(/\//g, '_')}.png`), fullPage: true });
    }
  });
}

test('retired URLs redirect', async ({ page }) => {
  await page.goto('/climbintel/');
  await page.waitForURL(/projects\/climb-intel\/$/);
  await page.goto('/roblox/');
  await page.waitForURL(/projects\/roblox-games\/$/);
});

test('unknown pages show the 404 page', async ({ request }) => {
  const res = await request.get('/404.html');
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('Not here.');
});

test('SkAI dashboard, report and poster are self-hosted', async ({ page, request }) => {
  expect((await request.get('/skai/poster.pdf')).status()).toBe(200);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/skai/dashboard/');
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
  await page.goto('/skai/report/');
  for (const img of await page.locator('img').all()) {
    const src = await img.getAttribute('src');
    expect((await request.get(new URL(src!, page.url()).pathname)).status(), src!).toBe(200);
  }
});
