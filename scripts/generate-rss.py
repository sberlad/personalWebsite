#!/usr/bin/env python3
"""Regenerate blog-rss.xml from blog-posts.json.

Run this after adding or editing a post in blog-posts.json, before
uploading the site. Buttondown's RSS-to-email automation checks this feed
every 30 minutes and sends a post's full content as an email the first time
it sees it, so this needs to stay in sync with blog-posts.json — this
script is the one-command way to do that instead of hand-editing both.

Usage: python3 scripts/generate-rss.py
"""
import json
import os
import re
from datetime import datetime, timezone
from email.utils import format_datetime
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://samuelberlad.com"

# blog-posts.json uses relative links (about.html, reach-me.html, ...) since
# they render fine on the site. An emailed post has no page to resolve those
# against, so make them absolute here rather than in the source data.
_INTERNAL_LINK = re.compile(r'href="(?!https?://|mailto:|#)([^"]+)"')


def absolutize(html):
    return _INTERNAL_LINK.sub(lambda m: f'href="{SITE}/{m.group(1)}"', html)

CHANNEL_CATEGORIES = ["Music", "Opera", "Classical Music", "Vocal Technique", "Chazzanut", "Career Development"]


def rfc822(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return format_datetime(dt)


def item_xml(post):
    link = f"{SITE}/blog.html#post-{post['id']}"
    categories = post.get("tags") or ([post["category"]] if post.get("category") else [])
    cat_xml = "\n        ".join(f"<category>{escape(c)}</category>" for c in categories)
    # content:encoded carries the full post so RSS-to-email sends the whole
    # thing, not just the card excerpt; <description> stays short for feed
    # readers that show it in a list.
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


def main():
    with open(os.path.join(ROOT, "blog-posts.json"), encoding="utf-8") as f:
        posts = json.load(f)["posts"]
    posts = sorted(posts, key=lambda p: p["date"], reverse=True)

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
    <generator>generate-rss.py</generator>
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
    out_path = os.path.join(ROOT, "blog-rss.xml")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(xml)
    print(f"Wrote {out_path} ({len(posts)} posts)")


if __name__ == "__main__":
    main()
