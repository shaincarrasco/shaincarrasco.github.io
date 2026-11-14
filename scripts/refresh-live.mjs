// Pulls the latest numbers (and, with --shots, a fresh screenshot) from projects that publish
// their own data, so the portfolio shows what those sites show today.
//
//   node scripts/refresh-live.mjs           numbers only  -> src/data/live.json
//   node scripts/refresh-live.mjs --shots   numbers + screenshots -> src/assets/shots/
//
// Runs in the deploy workflow before every build (on push, daily, and when a project pings).
// If a source is down, the committed snapshot stays and the build goes ahead.
import fs from 'node:fs/promises';

const OUT = 'src/data/live.json';
const D1 = 'https://shaincarrasco.github.io/D1-Basketball-Analytics/';

const live = JSON.parse(await fs.readFile(OUT, 'utf8').catch(() => '{}'));

async function json(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

const pct = (x) => `${(x * 100).toFixed(1)}%`;
const fmt = (n) => n.toLocaleString('en-US');

try {
  const m = await json(`${D1}data/model-2027.json`);
  const bt = m.backtest?.all;
  if (!bt?.games || !m.rankedTeams) throw new Error('model-2027.json is missing backtest or rankedTeams');
  live['d1-hoops'] = {
    asOf: m.updatedAt,
    source: `${D1}data/model-2027.json`,
    metrics: [
      { value: pct(bt.accuracy), label: `of ${fmt(bt.games)} out-of-sample game picks right this season (walk-forward backtest)`, kind: 'measured' },
      { value: String(m.rankedTeams), label: 'Division I teams rated by the model, refreshed hourly in season', kind: 'measured' },
      { value: bt.marginMAE.toFixed(1), label: 'points mean absolute error on the predicted margin', kind: 'measured' },
    ],
  };
  console.log('d1-hoops', live['d1-hoops'].metrics.map((x) => x.value).join(' | '));
} catch (e) {
  console.warn('d1-hoops: kept the committed numbers.', e.message);
}

await fs.writeFile(OUT, JSON.stringify(live, null, 2) + '\n');

if (process.argv.includes('--shots')) {
  try {
    const { chromium } = await import('@playwright/test');
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
    await page.goto(D1, { waitUntil: 'networkidle', timeout: 60_000 });
    // Close the first-visit explainer so the shot shows the product, not the onboarding note.
    await page.getByRole('button', { name: /close|dismiss/i }).first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'src/assets/shots/d1-hoops.png' });
    await browser.close();
    console.log('d1-hoops screenshot refreshed');
  } catch (e) {
    console.warn('d1-hoops: kept the committed screenshot.', e.message);
  }
}
