// Renders the GitHub profile banner as an SVG whose text is converted to paths,
// so it looks identical on every machine. Output: ../profile-readme/assets/banner.svg
import satori from 'satori';
import fs from 'node:fs/promises';
import path from 'node:path';

const fontDir = 'node_modules/@fontsource/bricolage-grotesque/files';
const font = (w) => fs.readFile(path.join(fontDir, `bricolage-grotesque-latin-${w}-normal.woff`));
const fonts = [
  { name: 'B', data: await font(400), weight: 400, style: 'normal' },
  { name: 'B', data: await font(800), weight: 800, style: 'normal' },
];
const W = 1280, H = 380;
const tree = {
  type: 'div',
  props: {
    style: { width: W, height: H, display: 'flex', background: '#07090c', fontFamily: 'B', color: '#f2ead9', padding: '60px 72px' },
    children: [
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: H - 120, width: W - 144 }, children: [
        { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [
          { type: 'div', props: { style: { width: 14, height: 14, borderRadius: 999, background: '#e3a33c' } } },
          { type: 'span', props: { style: { fontSize: 24, color: '#a79c88' }, children: 'shaincarrasco.github.io' } },
        ] } },
        { type: 'span', props: { style: { fontSize: 112, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.9 }, children: 'Shain Carrasco' } },
        { type: 'span', props: { style: { fontSize: 28, lineHeight: 1.35, color: '#d9d1c0', maxWidth: 1000 }, children: 'Software developer in Chicago. Research at the SkAI Institute, Climb Intel, HoopLab, WildAtlas and Roblox games.' } },
      ] } },
    ],
  },
};
const svg = await satori(tree, { width: W, height: H, fonts });
const out = path.resolve('../profile-readme/assets/banner.svg');
await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, svg);
console.log('banner', out, (svg.length / 1024).toFixed(1) + ' KB');
