# Linagora Engineering Blog

The Linagora engineering blog — bilingual (EN / FR) technical articles, statically generated from Markdown files.

---

## Stack

- [**Astro 5**](https://astro.build) — static site generator
- [**Tailwind CSS 4**](https://tailwindcss.com) — styling via CSS tokens
- [**MDX**](https://mdxjs.com) — enriched Markdown for articles
- [**Shiki**](https://shiki.style) — syntax highlighting
- [**Pagefind**](https://pagefind.app) — client-side full-text search
- **TypeScript** strict throughout

---

## Quick start

```bash
nvm use 22           # Astro 5 requires Node 20+
npm install
npm run dev          # http://localhost:4321
npm run build        # static build + Pagefind index in dist/
npm run preview      # local server to test the build
```

> In `dev` mode the Pagefind search index is not generated — the search modal shows a fallback.
> To test it locally, run `npm run build && npm run preview`.

---

## Writing an article

### 1. File naming

```
src/content/posts/<slug>.<lang>.md
```

- `<slug>` — URL-friendly, kebab-case, **identical between EN and FR** to link the translations.
- `<lang>` — `en` or `fr`.

Examples:

```
src/content/posts/migrating-to-astro.en.md
src/content/posts/migrating-to-astro.fr.md
src/content/posts/post-mortem-may-incident.en.md   # EN-only, OK
```

An article that exists in only one language **will not appear in the other language's listing** and the language switcher button will be disabled.

### 2. Frontmatter

```yaml
---
title: My great article
description: A short summary (~160 chars) used for SEO and cards.
date: 2026-05-04                # ISO date (required)
updated: 2026-06-01             # optional
authors: [linagora-team]        # IDs of files in src/content/authors/ (at least one)
tags: [astro, devops]           # optional
cover: /covers/my-article.jpg   # optional — path under public/
coverAlt: Description           # required if `cover` is set
draft: false                    # optional, defaults to false
---
```

### 3. Body

Plain Markdown or MDX. Syntax highlighting is automatic:

````markdown
```ts
const hello = (name: string) => `Hello ${name}!`;
```
````

### 4. Adding an author

```
src/content/authors/<id>.md
```

```yaml
---
name: Jane Doe
title: Senior Software Engineer
bio: A short bio.
avatar: /authors/jane-doe.jpg   # optional, in public/
github: janedoe                 # optional
linkedin: janedoe               # optional (LinkedIn slug)
mastodon: https://floss.social/@janedoe
website: https://janedoe.dev
---
```

Reference the author in the article frontmatter: `authors: [jane-doe]`.

### 5. Workflow

1. **Fork** the repository (or create a branch if you have direct access)
2. **Add** your `.md` file(s)
3. **Test** locally: `npm run build`
4. **Open a Pull Request** against `main`

CI validates the build and the type-check. After merging to `main`, the Docker image is published to GHCR.

---

## Project structure

```
src/
├── content/
│   ├── posts/           # ← articles (.md, one per language)
│   └── authors/         # ← author profiles
├── content.config.ts    # Zod schemas (frontmatter)
├── i18n/                # UI strings + routing helpers
├── layouts/             # Base + Post layouts
├── components/          # reusable Astro components
├── pages/[lang]/        # dynamic per-language pages
├── lib/posts.ts         # collection query helpers
├── styles/global.css    # CSS tokens + prose styles
└── site.config.ts       # name, URL, GitHub repo info
```

---

## Customising

| What | Where |
|---|---|
| Blog name, GitHub repo, social URLs | `src/site.config.ts` |
| Colour tokens, typography, dark mode | `src/styles/global.css` |
| UI strings (EN/FR) | `src/i18n/ui.ts` |
| About page copy | `src/pages/[lang]/about.astro` |
| Logo / favicon | `public/favicon.svg`, `src/components/LinagoraLogo.astro` |
| Default OG image | `public/og-default.svg` _(or replace with a 1200×630 `.png`)_ |
| Auto-generated cover gradients | `src/components/AutoCover.astro` |

---

## Deployment

### Docker image

```bash
docker build -t linagora/engineering-blog:latest .
docker run -p 8080:8080 linagora/engineering-blog:latest
```

The image serves the site on port `8080` via nginx.

### CI/CD

The `.github/workflows/deploy.yml` workflow builds and pushes the image to **GHCR** (`ghcr.io/<owner>/<repo>`) on every push to `main`.

**To wire on Linagora infrastructure** (left as a TODO in the workflow):
- Either SSH + `docker compose pull && docker compose up -d`
- Or `kubectl set image` on a Kubernetes Deployment
- Or a webhook to an internal orchestrator

### Configuration

| File | What |
|---|---|
| `src/site.config.ts` | Canonical site URL (edit `SITE.url`), GitHub org/repo for the "Edit on GitHub" links |
| `astro.config.ts` | i18n config, redirects, integrations |

---

## Search

Pagefind indexes content tagged with `data-pagefind-body` (= each article body). The index is generated at the end of `npm run build` under `dist/pagefind/`.

Language filtering is automatic: Pagefind respects the `lang` attribute of the page's `<html>` tag.

Shortcut: <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>.

---

## Licence

The blog code is licensed under [AGPL-3.0]. Published articles belong to their authors and are released under [CC BY-SA 4.0] unless the frontmatter states otherwise (`license: ...`).

[AGPL-3.0]: https://www.gnu.org/licenses/agpl-3.0.html
[CC BY-SA 4.0]: https://creativecommons.org/licenses/by-sa/4.0/
