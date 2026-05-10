---
title: Bienvenue sur le blog d'ingénierie de Linagora
description: Le premier article. Pourquoi on lance ce blog, ce que vous y trouverez, et comment y contribuer.
date: 2026-05-04
authors: [linagora-team]
tags: [meta, open-source]
draft: false
---

Bienvenue ! Vous lisez le tout premier article du **blog d'ingénierie de Linagora**. Au menu : retours d'expérience, plongées dans le code, choix d'architecture, et tout ce qu'on a envie de partager autour de l'open source.

## Pourquoi un blog ?

On code beaucoup. On tire des leçons de ce qu'on construit, parfois douloureusement. Le problème : ces leçons restent souvent confinées à un thread Slack ou à un commit message qu'on relira jamais. Ce blog est notre tentative de **rendre visible ce qui se passe vraiment** dans nos coulisses techniques.

## Ce que vous trouverez ici

- **Articles techniques** sur les langages, les frameworks et les patterns qu'on utilise au quotidien.
- **Retours d'expérience** sur des projets précis : ce qui a marché, ce qui a foiré, et pourquoi.
- **Réflexions sur l'open source** — la souveraineté numérique, la collaboration ouverte, les modèles économiques viables.
- **Outils maison** qu'on libère sous licence open source.

## Un exemple de code

Pour vérifier que la coloration syntaxique fonctionne :

```ts
// Un petit helper pour formater une date selon la locale
export function formatDate(date: Date, lang: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

## Comment contribuer ?

Ce blog est **open source**. Si vous travaillez chez Linagora et avez quelque chose à raconter, c'est très simple :

1. Forkez le dépôt sur GitHub.
2. Créez une branche.
3. Ajoutez votre article dans `src/content/posts/<slug>.fr.md` (et idéalement `<slug>.en.md` pour la version anglaise).
4. Ouvrez une Pull Request.

Le guide complet est dans le `README.md` du dépôt.

## Et la suite ?

D'autres articles arrivent bientôt. En attendant, n'hésitez pas à nous suivre sur le flux RSS, ou à venir discuter sur Mastodon.

Bonne lecture.
