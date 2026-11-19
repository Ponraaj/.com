# ponraaj.com

Personal site and blog built with Astro 7, MDX, Tailwind CSS, and the Cloudflare adapter.

## Commands

```sh
pnpm dev       # Start the local site at http://localhost:3000
pnpm check     # Astro diagnostics and formatting validation
pnpm build     # Build for Cloudflare Workers
pnpm preview   # Preview the production build locally
pnpm deploy    # Build and deploy with Wrangler
```

Blog posts live in `src/content/blog/` and use Astro Content Collections with typed frontmatter. Markdown and MDX code fences use Astro's built-in Shiki syntax highlighting.
