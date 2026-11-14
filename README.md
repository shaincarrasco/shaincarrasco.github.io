# shaincarrasco.github.io

Portfolio site. Astro 7 + Tailwind 4, content collection in `src/content/projects/*.mdx`, deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`.

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # dist/
pnpm test       # Playwright: every page renders, every internal link resolves, screenshots to screenshots/
```

Add a project: one `.mdx` file in `src/content/projects/` with the front-matter in `src/content.config.ts`. Numbers in `metrics` must trace to a README line or a live page.

Live numbers: `node scripts/refresh-live.mjs [--shots]` pulls the latest figures (and screenshots) from projects that publish their own data, currently D1 Hoops, into `src/data/live.json`. The deploy workflow runs it before every build and rebuilds daily at 13:23 UTC.

GitHub profile: the site publishes `/profile.json` and `/profile/banner.svg`. The profile repo (`shaincarrasco/shaincarrasco`) reads them hourly and rewrites its banner and "Selected work" table, so change `FEATURED` / `PROFILE_EXTRA` in `src/site.ts`, a project's front-matter, or the colours in `global.css`, and the profile follows. Set a `PROFILE_SYNC_TOKEN` secret to make it resync right after each deploy.

The previous single-page site is on the `legacy` branch (tag `v1-legacy`).
