import type { APIRoute } from 'astro';
import { renderBanner } from '../../lib/og';
import { profileFeed } from '../../lib/profile';
import { SITE } from '../../site';

export const GET: APIRoute = async () => {
  const { bannerLine } = await profileFeed();
  const svg = await renderBanner({ name: SITE.name, host: new URL(SITE.url).host, line: bannerLine });
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
