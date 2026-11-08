import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    short: z.string().optional(),
    status: z.enum(['live', 'released', 'in-development', 'research', 'alpha', 'planning', 'archived']),
    visibility: z.enum(['public', 'private']),
    category: z.enum(['product', 'research', 'tools', 'games', 'archive']),
    repo: z.string().url().optional(),
    live: z.string().optional(),
    stack: z.array(z.string()).default([]),
    metrics: z.array(z.object({ value: z.string(), label: z.string(), source: z.string().optional(), kind: z.enum(['measured', 'spec']).default('measured') })).default([]),
    accent: z.enum(['lime', 'cyan', 'magenta', 'amber']).default('lime'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    device: z.enum(['desktop', 'phone', 'figure']).default('desktop'),
    year: z.number(),
    order: z.number().default(100),

  }),
});

export const collections = { projects };
