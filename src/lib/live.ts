import type { CollectionEntry } from 'astro:content';
import live from '../data/live.json';

type Metric = CollectionEntry<'projects'>['data']['metrics'][number];
type Live = Record<string, { asOf: string; source: string; metrics: Metric[] }>;

/** A project's metrics: the latest numbers from its own site when scripts/refresh-live.mjs fetched them, else the front-matter. */
export function metricsOf(p: CollectionEntry<'projects'>): Metric[] {
  const l = (live as Live)[p.id];
  return l?.metrics?.length ? l.metrics.map((m) => ({ ...m, source: l.source })) : p.data.metrics;
}

/** When the live numbers were last published by the project, if they came from it. */
export function liveAsOf(id: string): Date | null {
  const l = (live as Live)[id];
  return l?.asOf ? new Date(l.asOf) : null;
}
