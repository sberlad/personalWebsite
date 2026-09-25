# personalWebsite
SamuelBerlad's professional singer portfolio website

## Structure

Plain static HTML, no build step. Each page is its own `.html` file.

- `css/main.css` – styles shared by every page: colours, header, navigation, mobile menu, footer
- `css/pages/<page>.css` – styles for one page only (loaded after `main.css`)
- `js/main.js` – behaviour shared by every page: mobile menu, header scroll effect, scroll-to-top button, footer year
- `js/pages/<page>.js` – scripts for one page only
- `roles-database.json` – roles shown on the home and repertoire pages

`404.html` is a standalone page and only uses `css/pages/404.css`.
The header and footer HTML is still repeated in each page, so nav changes need to be made in every `.html` file.

## Blog (Substack)

New posts are written on Substack, not on this site. `blog.html` shows the
latest posts and a subscribe box, but it needs a small server-side piece —
`/api/posts` — to fetch them, because Substack's feed doesn't allow being
read directly from a browser on another domain. See `src/index.js`.

**This currently does not work on the live IONOS static hosting** — plain
static file hosting can't run `src/index.js`. Until the site is deployed on
Cloudflare instead, `blog.html` will just show its "no posts yet" message.
It's built and committed now so it's ready to switch on.

To make it live:

1. **Create the Substack** at substack.com, if it doesn't exist yet. The
   address becomes `https://<name>.substack.com`.
2. **Move hosting to Cloudflare Workers**: Workers & Pages → Create → Import
   a repository → this repo. No build step; it deploys using `wrangler.jsonc`.
3. **Set the environment variable** in the Worker's Settings → Variables and
   Secrets: `SUBSTACK_URL = https://<name>.substack.com`. Redeploy after
   saving.
4. **Check** `https://samuelberlad.com/api/posts` — it should return JSON
   with the latest posts. If `posts` is empty, the `error` field says why.

Files involved:

    src/index.js       Cloudflare Worker: serves the whole site + /api/posts
    wrangler.jsonc      Worker configuration
    blog.html           the blog page
    js/pages/blog.js     fetches /api/posts, renders cards, opens a reader
                         modal with the full post, and shares to Substack's URL
    css/pages/blog.css   styling for the cards, subscribe box, and reader modal

Cloudflare caches the feed for an hour, so a new Substack post appears on
the site within about an hour of publishing — nothing else to update.
