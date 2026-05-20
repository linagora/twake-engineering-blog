export const SITE = {
  name: 'Linagora Engineering',
  shortName: 'Engineering',
  url: 'https://blog.twake.app',
  description: {
    fr: "Le blog d'ingénierie de Linagora — articles techniques, retours d'expérience et open source.",
    en: 'The Linagora engineering blog — technical articles, lessons learned and open source.',
  },
  github: {
    org: 'linagora',
    repo: 'twake-engineering-blog',
    branch: 'main',
  },
  social: {
    mastodon: 'https://floss.social/@linagora',
    linkedin: 'https://www.linkedin.com/company/linagora',
  },
} as const;

export const githubEditUrl = (postRelativePath: string): string => {
  const { org, repo, branch } = SITE.github;
  return `https://github.com/${org}/${repo}/edit/${branch}/src/content/posts/${postRelativePath}`;
};

export const githubRepoUrl = (): string => {
  const { org, repo } = SITE.github;
  return `https://github.com/${org}/${repo}`;
};
