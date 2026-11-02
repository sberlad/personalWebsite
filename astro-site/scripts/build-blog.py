#!/usr/bin/env python3
"""Build blog-posts.json and blog-rss.xml from the Markdown files in posts/.

This is the ONLY thing you run to publish or edit a post. Writing a post no
longer means hand-editing JSON — it means writing a Markdown file and running
this script.

    python3 scripts/build-blog.py

Usage: to add a post, create posts/some-short-slug.md (see any existing file
in posts/ for the format) and run this script. To edit a post, edit its file
and run this script again. Then upload blog-posts.json, blog-rss.xml, and any
new images with the rest of the site.

A post's slug (its filename, without .md) becomes its permanent id and the
#post-<slug> anchor it's shared and linked by — keep a file's name the same
once it's published, the same way you wouldn't change a URL.

--------------------------------------------------------------------------
Post file format
--------------------------------------------------------------------------
A block of "Key: value" lines, a line containing only "---", then the post
body:

    Title: Your Post Title
    Date: 2026-09-25
    Category: opera
    Image: images/blog/your-image.jpg
    Tags: Wagner, Alberich, Harztheater
    Featured: true
    ---

    Body goes here.

Title and Date are required. Category defaults to "general". Image, Tags
(comma-separated) and Featured (true/false) are optional. Excerpt is also
optional — an omitted one is generated from the body's first paragraph.

The body is Markdown: blank lines separate paragraphs, "## " and "### "
start a heading, **bold**, *italic*, and [link text](url) all work (no
_italic_ with underscores — that clashes with target="_blank" and similar
in raw HTML). A paragraph can also just contain raw HTML (an existing
<a href>, <strong>, etc.) — anything that isn't recognised Markdown syntax
is left exactly as written, so this never fights you if you paste in HTML.
"""
import glob
import json
import os
import re
from datetime import datetime, timezone
from email.utils import format_datetime
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "posts")
SITE = "https://samuelberlad.com"

CHANNEL_CATEGORIES = ["Music", "Opera", "Classical Music", "Vocal Technique", "Chazzanut", "Career Development"]

SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")

# --------------------------------------------------------------------------
# Markdown (small, deliberate subset — see the module docstring)
# --------------------------------------------------------------------------

_LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
_BOLD = re.compile(r"\*\*(.+?)\*\*")
_ITALIC = re.compile(r"(?<!\*)\*([^*\n]+)\*(?!\*)")
_HTML_BLOCK_START = re.compile(r"^<(h1|h2|h3|h4|blockquote|ul|ol|div|table|figure)\b", re.I)

# Deliberately no _italic_ syntax: existing posts already contain raw HTML
# (target="_blank" and similar), and a single underscore there would be
# misread as opening italics. Use *italic* instead.


def inline(text):
    text = _LINK.sub(r'<a href="\2">\1</a>', text)
    text = _BOLD.sub(r"<strong>\1</strong>", text)
    text = _ITALIC.sub(r"<em>\1</em>", text)
    return text


def render_markdown(body, is_first_block_title=True):
    blocks = [b.strip() for b in re.split(r"\n\s*\n", body.strip()) if b.strip()]
    html_blocks = []
    for i, block in enumerate(blocks):
        if is_first_block_title and i == 0 and block.startswith("# "):
            continue  # a leading "# Title" duplicates the frontmatter Title — drop it
        if _HTML_BLOCK_START.match(block):
            html_blocks.append(block)  # already a full HTML block; pass through untouched
        elif block.startswith("### "):
            html_blocks.append(f"<h3>{inline(block[4:].strip())}</h3>")
        elif block.startswith("## "):
            html_blocks.append(f"<h2>{inline(block[3:].strip())}</h2>")
        else:
            html_blocks.append(f"<p>{inline(block)}</p>")
    return "\n\n".join(html_blocks)


def plain_text_excerpt(html, length=200):
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return (text[:length].rsplit(" ", 1)[0] + "…") if len(text) > length else text


# --------------------------------------------------------------------------
# Parsing posts/*.md
# --------------------------------------------------------------------------

def parse_post(path):
    slug = os.path.splitext(os.path.basename(path))[0]
    if not SLUG_RE.match(slug):
        raise ValueError(
            f"{path}: filename must be lowercase words separated by hyphens "
            f"(e.g. becoming-wagners-alberich.md), got '{slug}'"
        )

    text = open(path, encoding="utf-8").read()
    if "\n---\n" not in text:
        raise ValueError(f"{path}: missing the '---' line that separates the metadata from the body")
    header, body = text.split("\n---\n", 1)

    meta = {}
    for line in header.strip().splitlines():
        if not line.strip():
            continue
        if ":" not in line:
            raise ValueError(f"{path}: metadata line isn't 'Key: value': {line!r}")
        key, value = line.split(":", 1)
        meta[key.strip().lower()] = value.strip()

    for required in ("title", "date"):
        if required not in meta:
            raise ValueError(f"{path}: missing required '{required.capitalize()}:' line")
    try:
        datetime.strptime(meta["date"], "%Y-%m-%d")
    except ValueError:
        raise ValueError(f"{path}: Date: {meta['date']!r} isn't in YYYY-MM-DD format")

    content_html = render_markdown(body)
    tags = [t.strip() for t in meta.get("tags", "").split(",") if t.strip()]
    excerpt = meta.get("excerpt", "").strip() or plain_text_excerpt(content_html)

    return {
        "id": slug,
        "title": meta["title"],
        "excerpt": excerpt,
        "content": content_html,
        "date": meta["date"],
        "category": meta.get("category", "general"),
        "image": meta.get("image", ""),
        "featured": meta.get("featured", "").strip().lower() == "true",
        "tags": tags,
    }


def load_posts():
    paths = sorted(glob.glob(os.path.join(POSTS_DIR, "*.md")))
    if not paths:
        raise SystemExit(f"No posts found in {POSTS_DIR}/ — nothing to build.")
    posts = [parse_post(p) for p in paths]
    # blog.js doesn't sort — it displays this array's order as-is, and only
    # ever shows the *first* post as the big "featured" card. So: newest
    # first, then a stable sort pulls any featured post(s) to the very front
    # without disturbing everyone else's date order.
    posts.sort(key=lambda p: p["date"], reverse=True)
    posts.sort(key=lambda p: not p["featured"])
    return posts


# --------------------------------------------------------------------------
# blog-posts.json
# --------------------------------------------------------------------------

def write_json(posts):
    path = os.path.join(ROOT, "blog-posts.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"posts": posts}, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote {path} ({len(posts)} posts)")


# --------------------------------------------------------------------------
# blog-rss.xml — full content, and internal links made absolute since an
# emailed post has no page to resolve a relative link against.
# --------------------------------------------------------------------------

_INTERNAL_LINK = re.compile(r'href="(?!https?://|mailto:|#)([^"]+)"')


def absolutize(html):
    return _INTERNAL_LINK.sub(lambda m: f'href="{SITE}/{m.group(1)}"', html)


def rfc822(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return format_datetime(dt)


def item_xml(post):
    link = f"{SITE}/blog.html#post-{post['id']}"
    categories = post["tags"] or ([post["category"]] if post.get("category") else [])
    cat_xml = "\n        ".join(f"<category>{escape(c)}</category>" for c in categories)
    return f"""    <item>
        <title>{escape(post['title'])}</title>
        <link>{link}</link>
        <description>{escape(post['excerpt'])}</description>
        <content:encoded><![CDATA[{absolutize(post['content'])}]]></content:encoded>
        <pubDate>{rfc822(post['date'])}</pubDate>
        <guid isPermaLink="true">{link}</guid>
        {cat_xml}
        <dc:creator>Samuel Berlad</dc:creator>
    </item>"""


def write_rss(posts):
    items = "\n\n".join(item_xml(p) for p in posts)
    now = format_datetime(datetime.now(timezone.utc))
    channel_cats = "\n    ".join(f"<category>{c}</category>" for c in CHANNEL_CATEGORIES)

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
    <title>Samuel Berlad Blog</title>
    <link>{SITE}/blog.html</link>
    <description>Insights on opera, vocal technique, and life as a professional bass-baritone.</description>
    <language>en-US</language>
    <lastBuildDate>{now}</lastBuildDate>
    <ttl>1440</ttl>
    <generator>build-blog.py</generator>
    <managingEditor>contact@samuelberlad.com (Samuel Berlad)</managingEditor>
    <webMaster>contact@samuelberlad.com (Samuel Berlad)</webMaster>
    <copyright>Copyright {datetime.now().year} Samuel Berlad. All rights reserved.</copyright>
    {channel_cats}

    <atom:link href="{SITE}/blog-rss.xml" rel="self" type="application/rss+xml"/>

    <image>
        <url>{SITE}/images/samuel-berlad-social.jpg</url>
        <title>Samuel Berlad Blog</title>
        <link>{SITE}/blog.html</link>
        <width>144</width>
        <height>144</height>
    </image>

{items}
</channel>
</rss>
"""
    path = os.path.join(ROOT, "blog-rss.xml")
    with open(path, "w", encoding="utf-8") as f:
        f.write(xml)
    print(f"Wrote {path} ({len(posts)} posts)")


def main():
    try:
        posts = load_posts()
        write_json(posts)
        write_rss(posts)
    except ValueError as e:
        raise SystemExit(f"error: {e}")


if __name__ == "__main__":
    main()
