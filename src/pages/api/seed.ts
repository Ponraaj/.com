import { getCollection } from 'astro:content';
import { env } from 'cloudflare:workers';

export const prerender = false;

export async function POST() {
  const posts = await getCollection('blog');

  let indexed = 0;
  for (const post of posts) {
    const body = (post.body || '').replace(/```[\s\S]*?```/g, ' ').replace(/---[\s\S]*?---/, '');
    const tags = JSON.stringify(post.data.tags);

    await env.DB.prepare(
      `INSERT OR REPLACE INTO posts (slug, title, excerpt, body, tags, published_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        post.id,
        post.data.title,
        post.data.excerpt,
        body,
        tags,
        post.data.publishedAt.toISOString()
      )
      .run();
    indexed++;
  }

  await env.DB.exec('INSERT INTO posts_fts(posts_fts) VALUES(\'rebuild\')');

  return new Response(
    JSON.stringify({ ok: true, indexed, total: posts.length }),
    { headers: { 'content-type': 'application/json' } }
  );
}
