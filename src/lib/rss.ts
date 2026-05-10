import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import type { Lang } from '../i18n/ui';
import { SITE } from '../site.config';
import { getPostsByLang } from './posts';

const localeTag: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US' };

export async function buildRssFeed(lang: Lang, context: APIContext) {
  const posts = await getPostsByLang(lang);
  return rss({
    title: `${SITE.name} — ${lang.toUpperCase()}`,
    description: SITE.description[lang],
    site: context.site ?? SITE.url,
    items: posts.map(({ entry, slug }) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description,
      link: `/${lang}/posts/${slug}`,
      categories: entry.data.tags,
    })),
    customData: `<language>${localeTag[lang]}</language>`,
  });
}
