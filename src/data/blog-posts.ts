import fm from 'front-matter';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  image: string;
  tags: Array<string>;
  readTime: number;
}

// Use Vite's import.meta.glob to import all MD files
const postModules = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function calculateReadTime(markdownContent: string): number {
  // Strip markdown syntax (headers, links, formatting)
  const plainText = markdownContent
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Remove links, keep text
    .replace(/^#+\s*/gm, '') // Remove headers
    .replace(/\*\*([^*]*)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]*)\*/g, '$1') // Remove italic
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  const wordCount = plainText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Code blocks take longer to read (estimate 50 words/minute for code)
  const codeBlockCount = (markdownContent.match(/```[\s\S]*?```/g) || [])
    .length;
  const codeWords = codeBlockCount * 50;

  // Images add time (12 seconds each, like Medium)
  const imageCount = (markdownContent.match(/!\[.*?\]\([^)]+\)/g) || []).length;
  const imageWords = ((imageCount * 12) / 60) * 200; // Convert seconds to word equivalent

  const totalWords = wordCount + codeWords + imageWords;
  const wordsPerMinute = 200; // Conservative estimate (Hugo uses 212)

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

function processPost(filePath: string, content: string): BlogPost {
  const slug = filePath.replace('./posts/', '').replace('.md', '');
  const { attributes, body: markdownContent } = fm(content);
  const data = attributes as any;

  return {
    id: slug,
    title: data.title,
    excerpt: data.excerpt,
    content: markdownContent,
    publishedAt: data.publishedAt,
    author: data.author,
    image: data.image,
    tags: data.tags,
    readTime: calculateReadTime(markdownContent), // Auto-calculate instead of data.readTime
  };
}

let cachedPosts: Array<BlogPost> | null = null;

function getAllPosts(): Array<BlogPost> {
  if (cachedPosts) return cachedPosts;

  const posts = Object.entries(postModules).map(([filePath, content]) =>
    processPost(filePath, content as string),
  );

  cachedPosts = posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return cachedPosts;
}

export const blogPosts: Array<BlogPost> = []; // Placeholder

export function getBlogPost(id: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.id === id);
}

export function getAllBlogPosts(): Array<BlogPost> {
  return getAllPosts();
}

export function getPreviousPost(currentPostId: string): BlogPost | null {
  const sortedPosts = getAllBlogPosts();
  const currentIndex = sortedPosts.findIndex(
    (post) => post.id === currentPostId,
  );
  if (currentIndex === -1 || currentIndex === sortedPosts.length - 1)
    return null;
  return sortedPosts[currentIndex + 1]; // Next older post
}

export function getNextPost(currentPostId: string): BlogPost | null {
  const sortedPosts = getAllBlogPosts();
  const currentIndex = sortedPosts.findIndex(
    (post) => post.id === currentPostId,
  );
  if (currentIndex === -1 || currentIndex === 0) return null;
  return sortedPosts[currentIndex - 1]; // Next newer post
}
