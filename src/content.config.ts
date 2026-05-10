import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
    // The id encodes the language as `<slug>.<lang>`. The default slugger strips
    // dots (turning `welcome.fr` into `welcomefr`) so we override it. We also
    // strip any directory prefix so posts in subfolders still produce a flat id.
    generateId: ({ entry }) => {
      const basename = entry.split('/').pop() ?? entry;
      return basename.replace(/\.(md|mdx)$/, '');
    },
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      authors: z.array(z.string()).min(1),
      tags: z.array(z.string()).default([]),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      canonical: z.string().url().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.cover && !data.coverAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '`coverAlt` is required when `cover` is set (accessibility).',
          path: ['coverAlt'],
        });
      }
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    mastodon: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

export const collections = { posts, authors };
