import { siteUrl } from '@lib/site';
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '@lib/posts';

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  const site = siteUrl(context.site).origin;

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Pon Raaj V',
    home_page_url: site,
    feed_url: `${site}/feed.json`,
    description: 'Just some thoughts and scribblings',
    items: posts.map((post) => ({
      id: `${site}/posts/${post.id}`,
      url: `${site}/posts/${post.id}`,
      title: post.data.title,
      summary: post.data.excerpt,
      date_published: post.data.publishedAt.toISOString(),
      tags: post.data.tags,
      image: post.data.image.startsWith('http')
        ? post.data.image
        : `${site}${post.data.image}`,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
    },
  });
};
