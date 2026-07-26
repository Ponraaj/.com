import { env } from 'cloudflare:workers';

export const prerender = false;

export async function GET({ params, request }: { params: { slug: string }; request: Request }) {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }

  const doId = env.POST_LIKES.idFromName(slug);
  const stub = env.POST_LIKES.get(doId);

  const url = new URL(request.url);
  const doUrl = new URL(`http://do/${slug}`);
  doUrl.search = url.search;

  const doResponse = await stub.fetch(new Request(doUrl, { method: 'GET' }));
  return doResponse;
}

export async function POST({ params, request }: { params: { slug: string }; request: Request }) {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }

  const body = await request.json();

  const doId = env.POST_LIKES.idFromName(slug);
  const stub = env.POST_LIKES.get(doId);

  const doResponse = await stub.fetch(new Request(`http://do/${slug}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }));
  return doResponse;
}
