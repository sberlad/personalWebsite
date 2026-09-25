# personalWebsite
SamuelBerlad's professional singer portfolio website

## Structure

Plain static HTML, no build step. Each page is its own `.html` file.

- `css/main.css` – styles shared by every page: colours, header, navigation, mobile menu, footer
- `css/pages/<page>.css` – styles for one page only (loaded after `main.css`)
- `js/main.js` – behaviour shared by every page: mobile menu, header scroll effect, scroll-to-top button, footer year
- `js/pages/<page>.js` – scripts for one page only
- `roles-database.json` – roles shown on the home and repertoire pages
- `posts/*.md` – blog posts, one file each (see "Writing a post" below);
  `blog-posts.json` and `blog-rss.xml` are generated from these — don't
  hand-edit either one

`404.html` is a standalone page and only uses `css/pages/404.css`.
The header and footer HTML is still repeated in each page, so nav changes need to be made in every `.html` file.

## Writing a post

Posts are Markdown files in `posts/`, one per post. To publish:

1. Create `posts/a-short-slug.md`. The filename becomes the post's permanent
   id and URL anchor (`#post-a-short-slug`), so keep it once it's picked.
2. Write it — see the format below, or copy an existing file in `posts/`.
3. Run `python3 scripts/build-blog.py`. This is the only command — it
   regenerates both `blog-posts.json` (what the site reads) and
   `blog-rss.xml` (what Buttondown reads) from everything in `posts/`.
4. Upload the site as usual (the two generated files, any new images, and
   the new post's `.md` file don't need to go live, but there's no harm if
   they do).

A post file looks like this:

    Title: Your Post Title
    Date: 2026-09-25
    Category: opera
    Image: images/blog/your-image.jpg
    Tags: Wagner, Alberich, Harztheater
    Featured: true
    ---

    Body goes here, as Markdown: blank lines between paragraphs, "## " and
    "### " for headings, **bold**, *italic*, and [link text](url). Raw HTML
    (an `<a href>` where you need a specific `target=` or `rel=`, say) also
    works untouched in the body if you need it.

Only `Title` and `Date` are required. `Category` defaults to "general".
`Image`, `Tags` (comma-separated) and `Featured` (`true`/`false`) are
optional, and so is `Excerpt:` — leave it out and one is generated from the
opening of the post. Setting `Featured: true` puts that post at the top of
the blog page in the large card; do this for at most one post at a time.

Editing an existing post: edit its `.md` file and run the same command
again — it's not additive, the two generated files are fully rebuilt from
whatever is in `posts/` each time.

## Email newsletter (Buttondown)

Buttondown handles only the email side — a subscribe form on `blog.html`,
and an automation that emails subscribers the full post whenever
`blog-rss.xml` gets a new item (checked roughly every 30 minutes, so
running `build-blog.py` after writing a post is what actually triggers the
email). No server, no dependency on Buttondown being up for the blog
itself to work — the posts live on this site regardless.

**One-time setup, once the Buttondown account exists:**

1. Create the account at buttondown.com.
2. In `blog.html`, replace `YOUR-BUTTONDOWN-USERNAME` with the real username
   (2 places, in the subscribe form).
3. In Buttondown's settings, under Connect RSS feed, add
   `https://samuelberlad.com/blog-rss.xml` and set the cadence to
   "immediately" (an email per post, as it's published) rather than a
   weekly/monthly digest.

Files involved:

    posts/*.md               write these — this is the only thing you edit by hand
    scripts/build-blog.py    the one command: posts/*.md -> blog-posts.json + blog-rss.xml
    blog-posts.json          generated — don't hand-edit
    blog-rss.xml             generated — don't hand-edit
    blog.html                the email subscribe form is near the top, in .email-subscribe
