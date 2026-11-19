/** Canonical site origin. Astro.site is set by astro.config; the fallback
 * keeps relative links correct in isolated previews. */
export const siteUrl = (site: URL | undefined): URL =>
  site ?? new URL('https://ponraaj.com');
