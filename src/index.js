// Cloudflare Worker: serves the static site (env.ASSETS) and handles
// GET /api/posts, which fetches the Substack RSS feed server-side — browsers
// can't do this themselves, because Substack's feed doesn't allow
// cross-origin requests — and returns a plain JSON list for blog.html.
//
// Requires deploying this repo to Cloudflare Workers (not the current IONOS
// static hosting, which can't run this file). Once deployed, set SUBSTACK_URL
// as an environment variable on the Worker:
//   Settings → Variables and Secrets → SUBSTACK_URL = https://samuelberlad.substack.com
//
// Until that variable is set to a real, published Substack, /api/posts
// returns an empty list with an `error` field, and blog.html shows its
// "no posts yet" message rather than fabricated placeholder content.

const DEFAULT_FEED = "https://samuelberlad.substack.com";

const clean = (s = "") =>
  s.replace(/<!\[CDATA\[|\]\]>/g, "")
   .replace(/<[^>]*>/g, " ")
   .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
   .replace(/\s+/g, " ").trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

async function handlePosts(env) {
  const base = (env.SUBSTACK_URL || DEFAULT_FEED).replace(/\/+$/, "");
  const headers = {
    "content-type": "application/json; charset=utf-8",
    // browser caches 10 min, Cloudflare edge caches 1 h and may serve stale for a day
    "cache-control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
  };

  try {
    const res = await fetch(`${base}/feed`, {
      headers: { "user-agent": "samuel-berlad-website" },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    const xml = await res.text();

    const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
      .slice(0, 12)
      .map((m) => {
        const item = m[1];
        const content = tag(item, "content:encoded") || tag(item, "description");
        const img = content.match(/<img[^>]+src=["']([^"']+)["']/i);
        const date = tag(item, "pubDate");
        return {
          title: clean(tag(item, "title")),
          url: clean(tag(item, "link")),
          date: date ? new Date(clean(date)).toISOString().slice(0, 10) : "",
          category: clean(tag(item, "category")),
          excerpt: clean(tag(item, "description") || content).slice(0, 220),
          image: img ? img[1] : "",
          html: tag(item, "content:encoded").replace(/<!\[CDATA\[|\]\]>/g, ""),
        };
      })
      .filter((p) => p.title && p.url);

    return new Response(JSON.stringify({ posts, source: base }), { headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ posts: [], source: base, error: String(err.message || err) }),
      { status: 200, headers }
    );
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/posts") return handlePosts(env);
    return env.ASSETS.fetch(request);
  },
};
