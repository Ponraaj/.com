import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '@lib/posts';

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();

  return rss({
    title: 'Pon Raaj V',
    description: 'Just some thoughts and scribblings',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.excerpt,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
};
