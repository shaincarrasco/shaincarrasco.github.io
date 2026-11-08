import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    short: z.string().optional(),
    status: z.enum(['live', 'in-development', 'research', 'alpha', 'planning', 'archived']),
    visibility: z.enum(['public', 'private']),
    category: z.enum(['product', 'research', 'tools', 'games', 'archive']),
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    stack: z.array(z.string()).default([]),
    metrics: z.array(z.object({ value: z.string(), label: z.string(), source: z.string().optional() })).default([]),
    accent: z.enum(['lime', 'cyan', 'magenta', 'amber']).default('lime'),
    image: z.string().optional(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
