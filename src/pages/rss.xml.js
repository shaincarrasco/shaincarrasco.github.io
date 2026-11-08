import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context) {
  const projects = await getCollection('projects');
  return rss({
    title: 'Shain Carrasco',
    description: 'Projects and updates',
    site: context.site,
    items: projects.map((p) => ({ title: p.data.title, description: p.data.tagline, link: `/projects/${p.id}/` })),
  });
}
