import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{png,jpg,jpeg,webp}', { eager: true });

/** Resolve a path under src/assets (e.g. "shots/climbintel.png") to optimizable image metadata. */
export function asset(p: string): ImageMetadata {
  const m = all[`../assets/${p}`];
  if (!m) throw new Error(`Missing image asset: src/assets/${p}`);
  return m.default;
}
