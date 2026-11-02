import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://samuelberlad.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file', // about.astro -> about.html, not about/index.html, to keep existing URLs
  },
  // Astro's default HTML compression strips ALL whitespace between tags
  // (not collapsed to one space like a browser would) — that silently
  // removed the natural gap between icons and text in many buttons/links
  // across the site. Keeping the original whitespace exactly instead.
  compressHTML: false,
});
