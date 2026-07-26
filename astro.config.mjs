// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import postBuild from './src/integrations/post-build';

export default defineConfig({
  site: 'https://ponraaj.me',
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare-binding',
  }),
  security: {
    checkOrigin: false,
  },
  integrations: [
    mdx({
      processor: unified({
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              content: { type: 'text', value: '#' },
              properties: { className: ['heading-anchor'] },
            },
          ],
        ],
      }),
    }),
    sitemap(),
    postBuild(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  fonts: [
    {
      name: 'EB Garamond',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      name: 'Baskervville',
      cssVariable: '--font-display',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
