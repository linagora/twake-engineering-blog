import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/site.config';
import { remarkReadingTime } from './src/lib/remark-reading-time';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    '/': '/en',
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', fr: 'fr-FR' },
      },
    }),
  ],
  vite: {
    // Tailwind v4 Vite plugin types currently mismatch Astro's Vite version.
    // It works at runtime; cast to silence the type-check.
    plugins: [tailwindcss()] as never,
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
});
