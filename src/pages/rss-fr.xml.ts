import type { APIContext } from 'astro';
import { buildRssFeed } from '../lib/rss';

export const GET = (ctx: APIContext) => buildRssFeed('fr', ctx);
