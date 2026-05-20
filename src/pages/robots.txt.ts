import type { APIContext } from 'astro';
import { SITE } from '../site.config';

export const GET = (ctx: APIContext) => {
  const sitemap = new URL('/sitemap-index.xml', ctx.site ?? SITE.url).toString();
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
