import { env } from 'cloudflare:workers';

export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }

  const key = `views:${slug}`;
  const count = parseInt((await env.VIEWS.get(key)) || '0', 10);

  return new Response(JSON.stringify({ slug, count }), {
    headers: { 'content-type': 'application/json' },
  });
}

export async function POST({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }

  const key = `views:${slug}`;
  const current = parseInt((await env.VIEWS.get(key)) || '0', 10);
  const count = current + 1;
  await env.VIEWS.put(key, String(count));

  return new Response(JSON.stringify({ slug, count }), {
    headers: { 'content-type': 'application/json' },
  });
}
