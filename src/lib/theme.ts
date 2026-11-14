import fs from 'node:fs';
import path from 'node:path';

// The site's palette, read from the Tailwind @theme block in global.css at build time.
// Generated images (OG cards, the GitHub profile banner) use it, so recolouring the site recolours them.
const css = fs.readFileSync(path.resolve('src/styles/global.css'), 'utf8');
const block = css.match(/@theme\s*{([^}]*)}/)?.[1] ?? '';
const vars = Object.fromEntries([...block.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

export const THEME = {
  night: vars['night'] ?? '#07090c',
  night2: vars['night-2'] ?? '#0f1419',
  rule: vars['rule'] ?? '#1c242c',
  chalk: vars['chalk'] ?? '#f2ead9',
  dim: vars['chalk-dim'] ?? '#a79c88',
  accent: vars['amber'] ?? '#e3a33c',
  teal: vars['teal'] ?? '#2f8f9e',
};
