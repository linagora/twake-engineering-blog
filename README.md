# Linagora Engineering Blog

Le blog d'ingénierie de Linagora — articles techniques bilingues (FR / EN) générés statiquement à partir de fichiers Markdown.

> _The Linagora engineering blog — bilingual (FR/EN) technical articles, statically generated from Markdown files._

---

## Stack

- [**Astro 5**](https://astro.build) — generateur statique
- [**Tailwind CSS 4**](https://tailwindcss.com) — styling via tokens CSS
- [**MDX**](https://mdxjs.com) — Markdown enrichi pour les articles
- [**Shiki**](https://shiki.style) — coloration syntaxique
- [**Pagefind**](https://pagefind.app) — recherche full-text côté client
- **TypeScript** strict partout

---

## Démarrage rapide

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # build statique + index Pagefind dans dist/
npm run preview      # serveur local pour tester le build
```

> En `dev`, l'index de recherche Pagefind n'est pas généré : la recherche affiche un fallback.
> Pour la tester en local, faire `npm run build && npm run preview`.

---

## Écrire un article

### 1. Nommage du fichier

```
src/content/posts/<slug>.<lang>.md
```

- `<slug>` : url-friendly, en kebab-case, **identique entre FR et EN** pour lier les traductions.
- `<lang>` : `fr` ou `en`.

Exemples :

```
src/content/posts/migrer-vers-astro.fr.md
src/content/posts/migrer-vers-astro.en.md
src/content/posts/post-mortem-incident-mai.fr.md   # FR uniquement, OK
```

Un article qui n'existe que dans une langue **n'apparaîtra pas dans la liste de l'autre langue** et le bouton de switch sera désactivé.

### 2. Frontmatter

```yaml
---
title: Mon super article
description: Un résumé court (~160 caractères) qui sert pour le SEO et les cards.
date: 2026-05-04                # ISO date (obligatoire)
updated: 2026-06-01             # optionnel
authors: [linagora-team]        # IDs de fichiers dans src/content/authors/ (au moins 1)
tags: [astro, devops]           # optionnel
cover: /covers/mon-article.jpg  # optionnel — chemin dans public/
coverAlt: Description alt        # recommandé si cover
draft: false                    # optionnel, défaut false
---
```

### 3. Corps

Markdown standard ou MDX. Coloration syntaxique automatique :

````markdown
```ts
const hello = (name: string) => `Hello ${name}!`;
```
````

### 4. Ajouter un auteur

```
src/content/authors/<id>.md
```

```yaml
---
name: Jane Doe
title: Senior Software Engineer
bio: Une bio courte.
avatar: /authors/jane-doe.jpg   # optionnel, dans public/
github: janedoe                 # optionnel
linkedin: janedoe               # optionnel (slug LinkedIn)
mastodon: https://floss.social/@janedoe
website: https://janedoe.dev
---
```

Référencez l'auteur dans le frontmatter de votre article : `authors: [jane-doe]`.

### 5. Workflow

1. **Forkez** le dépôt (ou créez une branche si vous avez les droits)
2. **Ajoutez** votre/vos fichier(s) `.md`
3. **Testez** localement : `npm run build`
4. **Ouvrez une Pull Request** vers `main`

La CI valide le build et le typecheck. Après merge sur `main`, l'image Docker est publiée sur GHCR.

---

## Structure du projet

```
src/
├── content/
│   ├── posts/           # ← articles .md (un par langue)
│   └── authors/         # ← profils auteurs
├── content.config.ts    # schémas Zod (frontmatter)
├── i18n/                # strings UI + helpers de routing
├── layouts/             # Base + Post layouts
├── components/          # composants Astro réutilisables
├── pages/[lang]/        # pages dynamiques par langue
├── lib/posts.ts         # helpers de requête sur la collection
├── styles/global.css    # tokens CSS + styles prose
└── site.config.ts       # nom, URL, infos du repo GitHub
```

---

## Personnaliser

| Quoi | Où |
|---|---|
| Nom du blog, repo GitHub, URLs sociaux | `src/site.config.ts` |
| Tokens couleur, typo, dark mode | `src/styles/global.css` |
| Strings d'interface (FR/EN) | `src/i18n/ui.ts` |
| Page À propos | `src/pages/[lang]/about.astro` |
| Logo / favicon | `public/favicon.svg` |
| Image OG par défaut | `public/og-default.svg` _(remplaçable par `.png` 1200×630)_ |

---

## Déploiement

### Image Docker

```bash
docker build -t linagora/engineering-blog:latest .
docker run -p 8080:8080 linagora/engineering-blog:latest
```

L'image expose le site sur le port `8080` via nginx.

### CI/CD

Le workflow `.github/workflows/deploy.yml` builde et pousse l'image sur **GHCR** (`ghcr.io/linagora/engineering-blog`) à chaque push sur `main`.

**À brancher sur l'infra Linagora** (étape laissée en TODO dans le workflow) :
- Soit SSH + `docker compose pull && docker compose up -d`
- Soit `kubectl set image` sur un Deployment Kubernetes
- Soit webhook vers un orchestrateur interne

### Variables / configuration

| Endroit | Quoi |
|---|---|
| `src/site.config.ts` | URL canonique du site (modifie `SITE.url`), org/repo GitHub pour les liens "Edit on GitHub" |
| `astro.config.ts` | Config i18n, redirects, intégrations |

---

## Recherche

Pagefind indexe le contenu balisé `data-pagefind-body` (= chaque article). L'index est généré à la fin de `npm run build` dans `dist/pagefind/`.

Le filtre par langue est automatique : Pagefind respecte l'attribut `lang` du `<html>` de chaque page.

Raccourci : <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>.

---

## Licence

Le code de ce blog est sous licence [AGPL-3.0]. Les articles publiés appartiennent à leurs auteurs et sont diffusés sous [CC BY-SA 4.0] sauf mention contraire dans le frontmatter (`license: ...`).

[AGPL-3.0]: https://www.gnu.org/licenses/agpl-3.0.html
[CC BY-SA 4.0]: https://creativecommons.org/licenses/by-sa/4.0/
