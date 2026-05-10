import type { Root } from 'mdast';
import type { Plugin } from 'unified';

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
}

function collectText(node: MdNode): string {
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(collectText).join(' ');
}

const WORDS_PER_MINUTE = 200;

export const remarkReadingTime: Plugin<[], Root> = () => {
  return (tree, file) => {
    const text = collectText(tree as unknown as MdNode);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    const data = file.data as { astro?: { frontmatter?: Record<string, unknown> } };
    data.astro = data.astro ?? {};
    data.astro.frontmatter = { ...(data.astro.frontmatter ?? {}), minutesRead: minutes };
  };
};
