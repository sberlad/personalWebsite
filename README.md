# personalWebsite
SamuelBerlad's professional singer portfolio website

## Structure

Plain static HTML, no build step. Each page is its own `.html` file.

- `css/main.css` – styles shared by every page: colours, header, navigation, mobile menu, footer
- `css/pages/<page>.css` – styles for one page only (loaded after `main.css`)
- `js/main.js` – behaviour shared by every page: mobile menu, header scroll effect, scroll-to-top button, footer year
- `js/pages/<page>.js` – scripts for one page only
- `roles-database.json` – roles shown on the home and repertoire pages
- `blog-posts.json` – blog posts

`404.html` is a standalone page and only uses `css/pages/404.css`.
The header and footer HTML is still repeated in each page, so nav changes need to be made in every `.html` file.

## Blog + email newsletter (Buttondown)

Posts are written and hosted directly on this site, same as always. Buttondown
is used only for the email side — a subscribe form on `blog.html`, and an
automation that emails subscribers whenever a new post appears in the RSS
feed. No server, no build step, no dependency on Buttondown being up for the
blog itself to work.

**To add a new post:**

1. Add it to `blog-posts.json` (title, excerpt, full `content` HTML, date, category, image, tags).
2. Run `python3 scripts/generate-rss.py` to regenerate `blog-rss.xml` from it.
3. Upload both files (and any new images) along with the rest of the site.

Buttondown checks the feed roughly every 30 minutes and emails subscribers
the full post the first time it sees it there — so step 2 isn't optional,
it's what tells Buttondown a new post exists.

**One-time setup, once the Buttondown account exists:**

1. Create the account at buttondown.com.
2. In `blog.html`, replace `YOUR-BUTTONDOWN-USERNAME` with the real username
   (2 places, in the subscribe form).
3. In Buttondown's settings, under Connect RSS feed, add
   `https://samuelberlad.com/blog-rss.xml` and set the cadence to
   "immediately" (an email per post, as it's published) rather than a
   weekly/monthly digest.

Files involved:

    blog-posts.json          the posts (unchanged from before)
    blog-rss.xml             generated — don't hand-edit, run the script instead
    scripts/generate-rss.py  regenerates blog-rss.xml from blog-posts.json
    blog.html                the email subscribe form is near the top, in .email-subscribe
