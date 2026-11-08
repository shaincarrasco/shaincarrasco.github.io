import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderCard, type Card } from '../../lib/og';

const pages: Record<string, Card> = {
  home: { title: 'Shain Carrasco', line: 'Software developer in Chicago. SkAI telescope research, Climb Intel, basketball analytics, a globe of life on Earth, Roblox games.', image: 'skai/des-globe-poster.webp' },
  work: { title: 'Work', line: 'Every project since 2022, with the number each one was measured on.' },
  research: { kicker: 'SkAI Institute, summer 2026', title: 'Grading a night in one number', line: 'A reward for AI telescope schedulers, tested on 105,889 Dark Energy Survey exposures.', image: 'skai/poster.png' },
  now: { title: 'Now', line: 'What I am building this month, and what comes next.' },
  about: { title: 'About', line: 'Software developer and researcher in Chicago.' },
  tools: { title: 'Tools', line: 'dowse, tripwire and catchup: small systems, tested and benchmarked.' },
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');
  return [
    ...Object.entries(pages).map(([slug, card]) => ({ params: { slug }, props: { card } })),
    ...projects.map((p) => ({
      params: { slug: `project-${p.id}` },
      props: { card: { kicker: p.data.status === 'research' ? 'Research' : undefined, title: p.data.title, line: p.data.short ?? p.data.tagline, image: p.data.image } as Card },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard((props as { card: Card }).card);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
