import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const pages = ['/', '/projects', '/projects/climb-intel', '/climbintel', '/tools', '/roblox', '/now', '/about'];

for (const p of pages) {
  test(`${p} renders and internal links resolve`, async ({ page }, info) => {
    const res = await page.goto(p);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
    for (const h of new Set(hrefs)) {
      if (h.startsWith('/#') || h.endsWith('.xml')) continue;
      const r = await page.request.get(h);
      expect(r.status(), `${h} from ${p}`).toBe(200);
    }
    const dir = path.join('screenshots', info.project.name);
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, `${p === '/' ? 'home' : p.slice(1).replace(/\//g, '_')}.png`), fullPage: true });
  });
}
