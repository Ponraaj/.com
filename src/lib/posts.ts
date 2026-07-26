import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

const POSTS_PER_PAGE = 10;

export function getPostsPerPage() {
  return POSTS_PER_PAGE;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export function calculateReadTime(markdownContent: string): number {
  const plainText = markdownContent
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = plainText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const codeBlockCount = (markdownContent.match(/```[\s\S]*?```/g) || [])
    .length;
  const codeWords = codeBlockCount * 50;
  const imageCount = (markdownContent.match(/!\[.*?\]\([^)]+\)/g) || []).length;
  const imageWords = ((imageCount * 12) / 60) * 200;

  const totalWords = wordCount + codeWords + imageWords;
  return Math.max(1, Math.ceil(totalWords / 200));
}

export function getRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit = 3,
): BlogPost[] {
  const tags = new Set(post.data.tags.map((t) => t.toLowerCase()));

  return allPosts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const shared = p.data.tags.filter((t) =>
        tags.has(t.toLowerCase()),
      ).length;
      return { post: p, shared };
    })
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function paginatePosts(posts: BlogPost[], page: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  return {
    posts: posts.slice(start, end),
    page: current,
    totalPages,
    totalPosts: posts.length,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}

export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  const lower = tag.toLowerCase();
  return posts.filter((p) =>
    p.data.tags.some((t) => t.toLowerCase() === lower),
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getAdjacentPosts(
  slug: string,
  allPosts: BlogPost[],
): { previous: BlogPost | null; next: BlogPost | null } {
  const index = allPosts.findIndex((p) => p.id === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: index < allPosts.length - 1 ? allPosts[index + 1]! : null,
    next: index > 0 ? allPosts[index - 1]! : null,
  };
}
