import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { THEME } from './theme';

const fontDir = path.resolve('node_modules/@fontsource/bricolage-grotesque/files');
let fonts: { name: string; data: Buffer; weight: 400 | 600 | 800; style: 'normal' }[] | null = null;
export async function loadFonts() {
  if (fonts) return fonts;
  const load = (w: 400 | 600 | 800) => fs.readFile(path.join(fontDir, `bricolage-grotesque-latin-${w}-normal.woff`));
  fonts = [
    { name: 'Bricolage', data: await load(400), weight: 400, style: 'normal' },
    { name: 'Bricolage', data: await load(600), weight: 600, style: 'normal' },
    { name: 'Bricolage', data: await load(800), weight: 800, style: 'normal' },
  ];
  return fonts;
}

async function imageData(publicPath: string, width: number, maxHeight: number) {
  const src = sharp(path.resolve('src/assets', publicPath));
  const meta = await src.metadata();
  const height = Math.min(maxHeight, Math.round((width * (meta.height ?? width)) / (meta.width ?? width)));
  const buf = await src.resize(width, height, { fit: 'cover', position: 'left top' }).png().toBuffer();
  return { url: `data:image/png;base64,${buf.toString('base64')}`, width, height };
}

export interface Card { title: string; kicker?: string; line?: string; image?: string; }

const { night: NIGHT, chalk: CHALK, dim: DIM, accent: AMBER, rule: RULE } = THEME;

export async function renderCard({ title, kicker, line, image }: Card): Promise<Buffer> {
  const IMG_W = 500, INNER_W = 1200 - 144, INNER_H = 630 - 144;
  const img = image ? await imageData(image, IMG_W, INNER_H) : null;
  const titleSize = img ? (title.length > 22 ? 56 : title.length > 14 ? 68 : 88) : (title.length > 26 ? 72 : title.length > 16 ? 88 : 112);
  const tree = {
    type: 'div',
    props: {
      style: { width: 1200, height: 630, background: NIGHT, display: 'flex', fontFamily: 'Bricolage', color: CHALK, padding: 72 },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: img ? INNER_W - IMG_W - 48 : INNER_W, height: INNER_H, flexShrink: 0 },
            children: [
              { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 600 }, children: [
                { type: 'div', props: { style: { width: 16, height: 16, borderRadius: 999, background: AMBER } } },
                { type: 'span', props: { children: 'Shain Carrasco' } },
              ] } },
              { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 22 }, children: [
                kicker ? { type: 'span', props: { style: { fontSize: 28, color: AMBER, fontWeight: 600 }, children: kicker } } : null,
                { type: 'span', props: { style: { fontSize: titleSize, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95 }, children: title } },
                line ? { type: 'span', props: { style: { fontSize: img ? 26 : 30, color: DIM, lineHeight: 1.35, maxWidth: img ? INNER_W - IMG_W - 48 : 900 }, children: line } } : null,
              ].filter(Boolean) } },
              { type: 'span', props: { style: { fontSize: 24, color: DIM }, children: 'shaincarrasco.github.io' } },
            ],
          },
        },
        img
          ? { type: 'div', props: { style: { display: 'flex', alignItems: 'center', marginLeft: 48, height: INNER_H }, children: [
              { type: 'img', props: { src: img.url, width: img.width, height: img.height, style: { border: `2px solid ${RULE}` } } },
            ] } }
          : null,
      ].filter(Boolean),
    },
  };
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

/** The GitHub profile banner (1280x380). Text is drawn as paths, so it looks the same everywhere. */
export async function renderBanner({ name, host, line }: { name: string; host: string; line: string }): Promise<string> {
  const W = 1280, H = 380;
  const tree = {
    type: 'div',
    props: {
      style: { width: W, height: H, display: 'flex', background: NIGHT, fontFamily: 'Bricolage', color: CHALK, padding: '60px 72px' },
      children: [
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: H - 120, width: W - 144 }, children: [
          { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [
            { type: 'div', props: { style: { width: 14, height: 14, borderRadius: 999, background: AMBER } } },
            { type: 'span', props: { style: { fontSize: 24, color: DIM }, children: host } },
          ] } },
          { type: 'span', props: { style: { fontSize: 112, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.9 }, children: name } },
          { type: 'span', props: { style: { fontSize: 28, lineHeight: 1.35, color: '#d9d1c0', maxWidth: 1000 }, children: line } },
        ] } },
      ],
    },
  };
  return satori(tree as any, { width: W, height: H, fonts: await loadFonts() });
}
