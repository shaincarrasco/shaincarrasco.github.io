# shaincarrasco.github.io

Portfolio site. Astro 7 + Tailwind 4, content collection in `src/content/projects/*.mdx`, deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`.

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # dist/
pnpm test       # Playwright: every page renders, every internal link resolves, screenshots to screenshots/
```

Add a project: one `.mdx` file in `src/content/projects/` with the front-matter in `src/content.config.ts`. Numbers in `metrics` must trace to a README line or a live page.

The previous single-page site is on the `legacy` branch (tag `v1-legacy`).
