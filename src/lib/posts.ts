import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type PostEntry = CollectionEntry<'posts'>;
export type AuthorEntry = CollectionEntry<'authors'>;

export interface PostInfo {
  entry: PostEntry;
  slug: string;
  lang: Lang;
}

export function parsePostId(id: string): { slug: string; lang: Lang } | null {
  const match = id.match(/^(.+?)\.(fr|en)$/);
  if (!match) return null;
  return { slug: match[1], lang: match[2] as Lang };
}

export function postRelativeFile(slug: string, lang: Lang): string {
  return `${slug}.${lang}.md`;
}

export async function getAllPosts(): Promise<PostInfo[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all
    .map((entry): PostInfo | null => {
      const parsed = parsePostId(entry.id);
      if (!parsed) return null;
      return { entry, ...parsed };
    })
    .filter((x): x is PostInfo => x !== null)
    .sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf());
}

export async function getPostsByLang(lang: Lang): Promise<PostInfo[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.lang === lang);
}

export async function hasTranslation(slug: string, lang: Lang): Promise<boolean> {
  const all = await getAllPosts();
  return all.some((p) => p.slug === slug && p.lang === lang);
}

export async function getAllTags(lang: Lang): Promise<Map<string, number>> {
  const posts = await getPostsByLang(lang);
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

export async function getPostsByTag(lang: Lang, tag: string): Promise<PostInfo[]> {
  const posts = await getPostsByLang(lang);
  return posts.filter((p) => (p.entry.data.tags ?? []).includes(tag));
}

export async function getPostsByAuthor(lang: Lang, authorId: string): Promise<PostInfo[]> {
  const posts = await getPostsByLang(lang);
  return posts.filter((p) => (p.entry.data.authors ?? []).includes(authorId));
}

export async function getAuthor(id: string): Promise<AuthorEntry | undefined> {
  return getEntry('authors', id);
}

export async function getAuthors(ids: string[]): Promise<AuthorEntry[]> {
  const all = await Promise.all(ids.map((id) => getEntry('authors', id)));
  return all.filter((a): a is AuthorEntry => a !== undefined);
}

export async function getAllAuthorsWithPosts(lang: Lang): Promise<AuthorEntry[]> {
  const posts = await getPostsByLang(lang);
  const ids = new Set<string>();
  for (const p of posts) {
    for (const id of p.entry.data.authors ?? []) ids.add(id);
  }
  return getAuthors([...ids]);
}
