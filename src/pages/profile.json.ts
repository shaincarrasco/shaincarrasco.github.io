import type { APIRoute } from 'astro';
import { profileFeed } from '../lib/profile';

// Read hourly by the profile repo's sync workflow (github.com/shaincarrasco/shaincarrasco).
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await profileFeed(), null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
