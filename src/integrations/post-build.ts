import type { AstroIntegration } from 'astro';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { frontmatter: {} as Record<string, unknown>, body: content };
  const raw = match[1];
  const frontmatter: Record<string, unknown> = {};
  for (const line of raw.split('\n')) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value: unknown = line.slice(sep + 1).trim();
    if (
      (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) ||
      (typeof value === 'string' && value.startsWith("'") && value.endsWith("'"))
    ) {
      value = (value as string).slice(1, -1);
    } else if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value); } catch { /* skip */ }
    }
    frontmatter[key] = value;
  }
  const body = content.slice(match[0].length);
  return { frontmatter, body };
}

const FONT_REGULAR =
  'https://fonts.gstatic.com/s/ebgaramond/v33/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUAw.ttf';
const FONT_BOLD =
  'https://fonts.gstatic.com/s/ebgaramond/v33/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-DPNUAw.ttf';

let fontData: { regular: Buffer; bold: Buffer } | undefined;

async function getFonts() {
  if (fontData) return fontData;
  const [regular, bold] = await Promise.all([
    fetch(FONT_REGULAR).then(async (r) => Buffer.from(await r.arrayBuffer())),
    fetch(FONT_BOLD).then(async (r) => Buffer.from(await r.arrayBuffer())),
  ]);
  fontData = { regular, bold };
  return fontData;
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len).trimEnd() + '...' : str;
}

async function loadImageDataURL(imagePath: string | null) {
  if (!imagePath) return null;
  const fullPath = resolve(ROOT, 'public', imagePath.replace(/^\//, ''));
  try {
    const buf = await readFile(fullPath);
    const ext = imagePath.endsWith('.png') ? 'png' : 'jpeg';
    return `data:image/${ext};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

async function getImageDataURL(filePath: string) {
  const fullPath = resolve(ROOT, filePath);
  const buf = await readFile(fullPath);
  const ext = filePath.endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,${buf.toString('base64')}`;
}

async function generateStaticOgImage(
  title: string,
  subtitle: string,
  satori: any,
  Resvg: any,
) {
  const { regular, bold } = await getFonts();
  const profileImage = await getImageDataURL('src/assets/images/denji-gamer-icon.jpeg');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200, height: 630,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          fontFamily: 'EB Garamond',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
                marginLeft: 80, marginRight: 24, flexShrink: 0,
                backgroundImage: `url(${profileImage})`,
                backgroundSize: 'cover',
                backgroundPosition: '-16.7px 0px',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 80 },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: { fontSize: 72, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.15, margin: 0, marginBottom: 16 },
                    children: truncate(title, 50),
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 24, color: '#94a3b8', margin: 0 },
                    children: subtitle,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200, height: 630,
      fonts: [
        { name: 'EB Garamond', data: regular, weight: 400, style: 'normal' },
        { name: 'EB Garamond', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, background: '#0f172a' });
  return resvg.render().asPng();
}

async function generateOgImage(
  title: string,
  subtitle: string,
  author: string | null,
  imagePath: string | null,
  satori: any,
  Resvg: any,
) {
  const { regular, bold } = await getFonts();
  const imageSrc = await loadImageDataURL(imagePath);
  const hasImage = !!imageSrc;

  const metaLine = author
    ? {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, color: '#94a3b8' },
          children: [
            { type: 'span', props: { children: author } },
            { type: 'span', props: { children: '·' } },
            { type: 'span', props: { children: subtitle } },
          ],
        },
      }
    : { type: 'div', props: { style: { fontSize: 24, color: '#94a3b8' }, children: subtitle } };

  const children = hasImage
    ? [
        { type: 'div', props: { style: { width: '50%', height: 630, overflow: 'hidden', display: 'flex' }, children: [{ type: 'img', props: { src: imageSrc, style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } } }] } },
        {
          type: 'div',
          props: {
            style: { width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 56 },
            children: [
              { type: 'h1', props: { style: { fontSize: 48, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2, margin: 0, marginBottom: 24 }, children: truncate(title, 50) } },
              metaLine,
            ],
          },
        },
      ]
    : [
        {
          type: 'div',
          props: {
            style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 64 },
            children: [
              { type: 'h1', props: { style: { fontSize: 56, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2, margin: 0, marginBottom: 24 }, children: truncate(title, 60) } },
              metaLine,
            ],
          },
        },
      ];

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200, height: 630, display: 'flex',
          flexDirection: hasImage ? 'row' : 'column',
          backgroundColor: '#0f172a', fontFamily: 'EB Garamond',
        },
        children,
      },
    },
    {
      width: 1200, height: 630,
      fonts: [
        { name: 'EB Garamond', data: regular, weight: 400, style: 'normal' },
        { name: 'EB Garamond', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, background: '#0f172a' });
  return resvg.render().asPng();
}

async function generateOGImages(logger: any) {
  const contentDir = resolve(ROOT, 'src', 'content', 'blog');
  const files = (await readdir(contentDir)).filter((f) => f.endsWith('.mdx'));

  interface PostData {
    slug: string; title: string; author: string; date: string; image: string | null;
    excerpt: string; tags: unknown; publishedAt: string; body: string;
  }
  const posts: PostData[] = [];
  for (const file of files) {
    const content = await readFile(resolve(contentDir, file), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const slug = file.replace(/\.mdx$/, '');
    const publishedAt = frontmatter.publishedAt as string | undefined;
    const date = new Date(publishedAt ?? Date.now()).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const cleanBody = (body || '').replace(/```[\s\S]*?```/g, ' ').replace(/---[\s\S]*?---/, '');
    posts.push({
      slug,
      title: (frontmatter.title as string) || slug,
      author: (frontmatter.author as string) || 'Pon Raaj V',
      date,
      image: (frontmatter.image as string) || null,
      excerpt: (frontmatter.excerpt as string) || '',
      tags: frontmatter.tags ?? [],
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      body: cleanBody,
    });
  }

  const staticPages = [
    { slug: 'index', title: 'Pon Raaj V', subtitle: 'Software developer based in Chennai' },
    { slug: 'blog', title: 'Blog', subtitle: 'Thoughts on technology, development, and life' },
    { slug: 'about', title: 'About', subtitle: 'Software developer based in Chennai' },
  ];

  const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm');
  const wasmBuffer = await readFile(wasmPath);

  const { initWasm, Resvg } = require('@resvg/resvg-wasm');
  await initWasm(wasmBuffer.buffer);

  const satori = require('satori').default;

  const sharp = require('sharp');

  const OUT_DIR = resolve(ROOT, 'dist', 'client', 'og');
  await mkdir(OUT_DIR, { recursive: true });
  let count = 0;

  for (const post of posts) {
    logger.info(`Generating OG image for ${post.slug}...`);
    const png = await generateOgImage(post.title, post.date, post.author, post.image, satori, Resvg);
    const compressed = await sharp(Buffer.from(png)).png({ compressionLevel: 9, palette: true }).toBuffer();
    await writeFile(resolve(OUT_DIR, `${post.slug}.png`), compressed);
    count++;
  }

  for (const page of staticPages) {
    logger.info(`Generating OG image for ${page.slug}...`);
    const png = await generateStaticOgImage(page.title, page.subtitle, satori, Resvg);
    const compressed = await sharp(Buffer.from(png)).png({ compressionLevel: 9, palette: true }).toBuffer();
    await writeFile(resolve(OUT_DIR, `${page.slug}.png`), compressed);
    count++;
  }

  logger.info(`Generated ${count} OG image(s).`);
  return posts;
}

function esc(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      return trimmed.slice(1, -1).split(',').map((t) => t.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return [];
}

async function generateSeedSql(posts: { slug: string; title: string; excerpt: string; body: string; tags: unknown; publishedAt: string }[], logger: any) {
  const lines: string[] = [];

  for (const post of posts) {
    const tagList = parseTags(post.tags).map((t) => t.replace(/"/g, '""'));
    const tagsEsc = `'["${tagList.join('","')}"]'`;
    lines.push(
      `INSERT OR REPLACE INTO posts (slug, title, excerpt, body, tags, published_at)\n` +
      `VALUES (${esc(post.slug)}, ${esc(post.title)}, ${esc(post.excerpt)}, ${esc(post.body)}, ${tagsEsc}, ${esc(post.publishedAt)});`
    );
  }

  lines.push(`\nINSERT INTO posts_fts(posts_fts) VALUES('rebuild');`);

  const outPath = resolve(ROOT, 'dist', 'seed.sql');
  await writeFile(outPath, lines.join('\n'));
  logger.info(`Generated seed.sql (${posts.length} posts)`);
}

async function patchWrangler(logger: any) {
  const wranglerPath = resolve(ROOT, 'dist', 'server', 'wrangler.json');
  try {
    const cfg = JSON.parse(await readFile(wranglerPath, 'utf-8'));

    for (const ns of cfg.kv_namespaces ?? []) {
      if (ns.binding === 'SESSION') {
        ns.id ??= 'session-dev';
        ns.preview_id ??= 'session-dev';
      }
    }

    for (const field of [
      'exports', 'ai_search_namespaces', 'ai_search', 'agent_memory',
      'artifacts', 'flagship', 'vpc_networks', 'python_modules', 'previews',
    ]) {
      delete cfg[field];
    }

    if (cfg.dev?.generate_types) delete cfg.dev.generate_types;

    const outPath = resolve(ROOT, 'dist', 'server', 'wrangler.dev.json');
    await writeFile(outPath, JSON.stringify(cfg, null, 2));
  } catch {
    logger.warn('Could not patch wrangler config');
  }
}

export default function postBuild(): AstroIntegration {
  return {
    name: 'post-build',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const posts = await generateOGImages(logger);
        await generateSeedSql(posts, logger);
        await patchWrangler(logger);
      },
    },
  };
}
