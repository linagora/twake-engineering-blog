---
title: Welcome to the Linagora engineering blog
description: The very first post. Why we're starting this blog, what you'll find here, and how to contribute.
date: 2026-05-04
authors: [linagora-team]
tags: [meta, open-source]
draft: false
---

Welcome! You're reading the very first post of the **Linagora engineering blog**. On the menu: lessons learned, code deep dives, architectural decisions, and everything we want to share around open source.

## Why a blog?

We write a lot of code. We learn from what we build, sometimes painfully. The problem: those lessons usually stay confined to a Slack thread or a commit message no one will ever re-read. This blog is our attempt to **make visible what actually happens** behind the scenes.

## What you'll find here

- **Technical articles** about the languages, frameworks and patterns we use every day.
- **War stories** from real projects: what worked, what blew up, and why.
- **Open source reflections** — digital sovereignty, open collaboration, sustainable business models.
- **In-house tools** that we release under open source licenses.

## A code sample

Just to make sure syntax highlighting works:

```ts
// A small helper that formats a date for a given locale
export function formatDate(date: Date, lang: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

## How to contribute

This blog is **open source**. If you work at Linagora and have something to share, it's straightforward:

1. Fork the repository on GitHub.
2. Create a branch.
3. Add your article under `src/content/posts/<slug>.en.md` (and ideally `<slug>.fr.md` for the French version).
4. Open a Pull Request.

The full guide lives in the repository's `README.md`.

## What's next?

More posts are coming soon. In the meantime, feel free to subscribe to the RSS feed, or chat with us on Mastodon.

Happy reading.
