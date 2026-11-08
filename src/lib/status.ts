export const STATUS_LABEL = {
  live: 'Live',
  released: 'Released',
  research: 'Research',
  'in-development': 'Building',
  alpha: 'Alpha',
  planning: 'Planning',
  archived: 'Earlier',
} as const;
export type Status = keyof typeof STATUS_LABEL;
