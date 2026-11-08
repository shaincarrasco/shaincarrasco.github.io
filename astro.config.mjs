import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://shaincarrasco.github.io',
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/og/') })],
  redirects: {
    '/climbintel': '/projects/climb-intel/',
    '/roblox': '/projects/roblox-games/',
  },
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'always' },
  trailingSlash: 'always',
});
