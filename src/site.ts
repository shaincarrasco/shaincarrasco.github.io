// One place for identity and contact details used across pages, JSON-LD and OG images.
export const SITE = {
  name: 'Shain Carrasco',
  url: 'https://shaincarrasco.github.io',
  role: 'Software developer and researcher',
  location: 'Chicago',
  description:
    'Shain Carrasco, software developer in Chicago. SkAI Institute research on telescope scheduling, Climb Intel, college basketball analytics, a 3D globe of life on Earth, and Roblox games.',
  github: 'https://github.com/shaincarrasco',
  email: 'shaintiberius@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shain-carrasco/',
  school: 'DePaul University',
  degree: 'Computer Science and Economics',
};

// The home page's "Selected work", in order. The GitHub profile README is generated from this
// list too (via /profile.json), so changing it here changes the profile within the hour.
export const FEATURED = ['climb-intel', 'd1-hoops', 'upset', 'wildatlas', 'lipread'];

// Extra rows for the profile README's table, after FEATURED.
export const PROFILE_EXTRA: (string | { title: string; href: string; line: string })[] = [
  'hooplab',
  'roblox-games',
  {
    title: 'dowse, tripwire, catchup',
    href: '/tools/',
    line: 'Dependency-free tools: vault search for my agents, a secret scanner, a scheduler for a laptop that sleeps. 139 of 139 planted secrets found, 0 false alarms.',
  },
];
