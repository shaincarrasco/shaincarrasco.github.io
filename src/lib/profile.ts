import { getCollection } from 'astro:content';
import { SITE, FEATURED, PROFILE_EXTRA } from '../site';
import { metricsOf } from './live';
import { THEME } from './theme';

const abs = (href: string) => new URL(href, SITE.url).toString();
const sentence = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

/** Everything the GitHub profile README shows that comes from the site. Served at /profile.json. */
export async function profileFeed() {
  const all = await getCollection('projects');
  const byId = new Map(all.map((p) => [p.id, p]));
  const work = [...FEATURED, ...PROFILE_EXTRA].flatMap((x) => {
    if (typeof x !== 'string') return [{ id: null, title: x.title, href: abs(x.href), caseStudy: null, code: null, line: sentence(x.line) }];
    const p = byId.get(x);
    if (!p) return [];
    const d = p.data;
    const caseStudy = abs(`/projects/${p.id}/`);
    const m = metricsOf(p).find((m) => m.kind === 'measured');
    const line = [sentence(d.short ?? d.tagline), m ? sentence(`${m.value} ${m.label}`) : ''].filter(Boolean).join(' ');
    return [{ id: p.id, title: d.title, href: d.live && !d.live.startsWith('/') ? d.live : caseStudy, caseStudy, code: d.repo ?? null, line }];
  });
  const named = FEATURED.map((id) => byId.get(id)?.data.title).filter(Boolean) as string[];
  const tagline = `Software developer in ${SITE.location}. Research at the SkAI Institute, ${list(named)}.`;
  // Same line with no-break spaces inside each name, so the banner never splits "D1 / Hoops".
  const bannerLine = `Software developer in ${SITE.location}. Research at the SkAI\u00a0Institute, ${list(named.map((n) => n.replace(/ /g, '\u00a0')))}.`;
  return {
    name: SITE.name,
    site: SITE.url,
    banner: abs('/profile/banner.svg'),
    tagline,
    bannerLine,
    theme: THEME,
    work,
  };
}
