# personalWebsite (Astro)

Astro rebuild of Samuel Berlad's website. Built to be pixel/behavior-identical
to the original flat-HTML site (verified page by page — see "Parity" below),
with one structural improvement: the header, nav, footer, and `<head>`
boilerplate that used to be hand-duplicated in every `.html` file now live
once in `src/layouts/BaseLayout.astro`.

## Structure

- `src/layouts/BaseLayout.astro` — shared shell (head meta/OG/Twitter tags,
  header/nav, footer, skip-link, consent/main.js script tags). Takes props
  for the things that differ per page (title, description, canonical URL,
  OG image, which optional fonts to load, the page's own script, etc.) and
  named slots for page-specific `<head>` additions (JSON-LD) and CSS.
- `src/pages/*.astro` — one file per page, same URLs as before
  (`about.astro` → `/about.html`, enforced via `build.format: "file"` in
  `astro.config.mjs` so routes don't become `/about/`).
- `src/pages/404.astro` — standalone, does not use BaseLayout (matches the
  original site, which gave 404 its own minimal design).
- `public/` — everything served as-is: `css/`, `js/`, `images/`, `fonts/`,
  favicons, `robots.txt`, `sitemap.xml`, the JSON data files
  (`roles-database.json`, `gallery-photos.json`, `press-quotes.json`,
  `blog-posts.json`, `blog-rss.xml`), `posts/*.md`, and `_headers`
  (Cloudflare security headers, carried over unchanged).

The actual page scripts (`public/js/pages/*.js`) and CSS
(`public/css/**`) are untouched from the original site — same files, same
behavior. Nothing was rewritten as an Astro component/island; every
interactive bit (mobile menu, cookie consent, gallery lightbox, language
switcher, video facades, search/filter) is still the same plain JS it always
was, just served from `public/` instead of the repo root.

## The blog pipeline is unchanged

`scripts/build-blog.py` still works exactly as before: write a post in
`public/posts/*.md`, run the script, it regenerates
`public/blog-posts.json` and `public/blog-rss.xml`. Astro isn't involved in
this at all — it's still a static JSON file that `public/js/pages/blog.js`
fetches client-side, same as on the original site. (Run the script from
this directory so its output lands in `public/`, not the repo root.)

## Developing

    npm install
    npm run dev       # local dev server with hot reload

## Deploying (Cloudflare Workers)

    npm install
    npx wrangler login     # one-time
    npm run deploy          # astro build && wrangler deploy

`npm run build` outputs to `dist/`; `wrangler.jsonc` points Cloudflare's
static-assets handler at that directory, with `dist/404.html` as the
fallback for unmatched routes (via `not_found_handling: "404-page"`).

## A couple of things kept deliberately "wrong"

Two pre-existing quirks from the original site were preserved exactly
rather than cleaned up during the conversion, since they weren't part of
the audited/approved fixes:

- `about.html` has no proper `<footer>` wrapper (no social icons there
  either) — `about.astro` overrides BaseLayout's `footer` slot to
  reproduce that exactly.
- The "Schubert's Die Forelle" / "Biden's" apostrophe style is
  inconsistent in a couple of spots on the videos page in the original
  copy — preserved as-is.

If either of these should actually be fixed, say so and it's a small change
in `about.astro` / `videos.astro` respectively.

## Parity verification

Before this replaces the flat-HTML site, it was checked against it
automatically: rendered DOM text (`document.body.innerText`) compared
byte-for-byte identical on all 10 pages at both desktop and mobile
viewports, full-page screenshots pixel-diffed (9/10 pages bit-identical,
the 10th had only sub-pixel font-rendering noise with already-confirmed
identical text), and a zero-console-error Playwright pass across every
page on both versions. Interactive features (cookie consent, skip link,
language switcher + Hebrew RTL, gallery lightbox, repertoire search,
video facade embeds, vCard download) were also functionally tested
against this Astro build specifically.
