import { env } from 'cloudflare:workers';

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || '';

  if (!q) {
    return new Response(JSON.stringify({ query: '', results: [] }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const sanitized = q.replace(/[^\w\s-]/g, '').trim();
  if (!sanitized) {
    return new Response(JSON.stringify({ query: q, results: [] }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const ftsQuery = sanitized
    .split(/\s+/)
    .map((t) => `"${t}"`)
    .join(' OR ');

  const stmt = env.DB.prepare(
    `SELECT slug, title, excerpt, tags
     FROM posts_fts
     WHERE posts_fts MATCH ?
     ORDER BY rank
     LIMIT 10`
  ).bind(ftsQuery);

  const { results } = await stmt.all<{
    slug: string;
    title: string;
    excerpt: string;
    tags: string;
  }>();

  return new Response(
    JSON.stringify({
      query: q,
      results: (results || []).map((row) => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        tags: JSON.parse(row.tags),
        url: `/posts/${row.slug}`,
      })),
    }),
    { headers: { 'content-type': 'application/json' } }
  );
}
