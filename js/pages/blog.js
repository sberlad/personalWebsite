// Scripts for blog.html only. Shared behaviour (menu, header, footer year) is in js/main.js.
//
// Posts are written on Substack and come in through /api/posts, which a
// Cloudflare Worker (src/index.js) fetches server-side from the Substack RSS
// feed — browsers can't fetch that feed directly, since it doesn't allow
// cross-origin requests. See README.md's "Blog (Substack)" section.
//
// On IONOS (the current static host) or before the newsletter has any posts,
// /api/posts isn't reachable or returns an empty list; renderEmpty() below
// shows a plain "no posts yet" message rather than fabricated example posts.

let allPosts = [];

const BLOCKED_SELECTOR = 'script,style,iframe,object,embed,form,input,button,link,meta,noscript,svg,video,audio,' +
    '.subscription-widget-wrap,.subscribe-widget,.button-wrapper,.captioned-button-wrap,.share-widget,.footnote-anchor';

// Substack posts carry their own scripts, embeds and subscribe buttons.
// Strip those out and neutralise anything else that could run script or
// point somewhere unexpected before the HTML is dropped into the page.
function sanitize(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.body.querySelectorAll(BLOCKED_SELECTOR).forEach(function (el) { el.remove(); });
    doc.body.querySelectorAll('*').forEach(function (el) {
        [...el.attributes].forEach(function (attr) {
            const name = attr.name.toLowerCase();
            const val = attr.value.trim().toLowerCase();
            const isUnsafeUrl = (name === 'href' || name === 'src') && !/^(https?:|mailto:|#|\/)/.test(val);
            if (name.startsWith('on') || name === 'style' || name === 'srcset' || name === 'class' || name === 'id' || isUnsafeUrl) {
                el.removeAttribute(attr.name);
            }
        });
        if (el.tagName === 'A') {
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener');
        }
    });
    return doc.body.innerHTML;
}

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

document.addEventListener('DOMContentLoaded', function () {
    loadPosts();
    bindModalDismiss();
});

async function loadPosts() {
    try {
        const response = await fetch('/api/posts', { headers: { accept: 'application/json' } });
        if (!response.ok) throw new Error('api responded ' + response.status);

        const data = await response.json();
        if (!Array.isArray(data.posts)) throw new Error('unexpected payload');
        if (!data.posts.length && data.error) throw new Error(data.error);

        if (data.source) setupSubscribeBox(data.source);
        allPosts = data.posts;
        allPosts.length ? renderPosts(allPosts) : renderEmpty();
    } catch (error) {
        console.warn('Could not load posts from Substack:', error);
        renderEmpty();
    }
}

function setupSubscribeBox(substackBase) {
    const box = document.getElementById('subscribeBox');
    if (box) {
        box.innerHTML =
            '<iframe src="' + substackBase + '/embed" width="480" height="150" style="border:none;background:white;" frameborder="0" scrolling="no"></iframe>';
    }
    const archiveLink = document.getElementById('archiveLink');
    if (archiveLink) {
        archiveLink.href = substackBase;
        archiveLink.style.display = '';
    }

    const rssLink = document.createElement('link');
    rssLink.rel = 'alternate';
    rssLink.type = 'application/rss+xml';
    rssLink.title = 'Samuel Berlad Blog RSS Feed';
    rssLink.href = substackBase + '/feed';
    document.head.appendChild(rssLink);
}

function renderEmpty() {
    const grid = document.getElementById('blogGrid');
    const noResults = document.getElementById('noResults');
    if (grid) grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
}

function renderPosts(posts) {
    const grid = document.getElementById('blogGrid');
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = 'none';
    if (!grid) return;

    grid.innerHTML = posts
        .map(function (post, index) { return index === 0 ? renderFeaturedPost(post, index) : renderRegularPost(post, index); })
        .join('');

    grid.querySelectorAll('.blog-card').forEach(function (card) {
        card.addEventListener('click', function () { openPost(+card.dataset.index); });
    });
}

function renderFeaturedPost(post, index) {
    const image = post.image ? "background-image: url('" + post.image + "')" : '';
    return (
        '<article class="featured-post blog-card" data-index="' + index + '">' +
            '<div class="featured-image" style="' + image + '"><div class="featured-label">Featured</div></div>' +
            '<div class="featured-content">' +
                (post.category ? '<div class="featured-category">' + post.category + '</div>' : '') +
                '<h2 class="featured-title">' + post.title + '</h2>' +
                '<p class="featured-excerpt">' + (post.excerpt || '') + '</p>' +
                '<div class="featured-meta">' + formatDate(post.date) + '</div>' +
                '<a href="' + post.url + '" class="read-more" onclick="event.stopPropagation()" target="_blank" rel="noopener">Read Full Post</a>' +
            '</div>' +
        '</article>'
    );
}

function renderRegularPost(post, index) {
    const image = post.image ? "background-image: url('" + post.image + "')" : '';
    return (
        '<article class="blog-card" data-index="' + index + '">' +
            '<div class="blog-image" style="' + image + '">' + (post.category ? '<div class="blog-category">' + post.category + '</div>' : '') + '</div>' +
            '<div class="blog-content">' +
                '<div class="blog-date">' + formatDate(post.date) + '</div>' +
                '<h3 class="blog-title">' + post.title + '</h3>' +
                '<p class="blog-excerpt">' + (post.excerpt || '') + '</p>' +
                '<a href="' + post.url + '" class="read-more" onclick="event.stopPropagation()" target="_blank" rel="noopener">Read More</a>' +
            '</div>' +
        '</article>'
    );
}

function openPost(index) {
    const post = allPosts[index];
    if (!post) return;

    const shareButtons = buildShareButtons(post);
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.id = 'postModal';
    modal.innerHTML =
        '<div class="post-modal-content">' +
            '<div class="post-modal-header"><button class="close-modal" onclick="closePostModal()">&times;</button></div>' +
            '<div class="post-modal-body">' +
                (post.category ? '<div class="post-category">' + post.category + '</div>' : '') +
                '<h1 class="post-title">' + post.title + '</h1>' +
                '<div class="post-meta">' + formatDate(post.date) + ' · <a href="' + post.url + '" target="_blank" rel="noopener">Continue reading on Substack</a></div>' +
                (post.image ? '<div class="post-image-container" style="margin: 2rem 0;">' +
                    '<img src="' + post.image + '" alt="' + post.title + '" style="width: 100%; height: 300px; object-fit: cover; border: 1px solid rgba(164, 32, 32, 0.3);">' +
                '</div>' : '') +
                '<div class="post-social-share"><h4>Share This Post</h4><div class="post-share-buttons">' + shareButtons + '</div></div>' +
                '<div class="post-content"></div>' +
                '<div class="post-social-share" style="margin-top: 2rem;"><h4>Enjoyed this post? Share it!</h4><div class="post-share-buttons">' + shareButtons + '</div></div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.querySelector('.post-content').innerHTML = sanitize(post.html || post.excerpt || '');

    modal.addEventListener('click', function (e) { if (e.target === modal) closePostModal(); });
}

function buildShareButtons(post) {
    const url = encodeURIComponent(post.url);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.title + ' — ' + (post.excerpt || '').slice(0, 100) + '...');
    return (
        '<a href="https://www.facebook.com/sharer/sharer.php?u=' + url + '" class="post-share-btn facebook" target="_blank" rel="noopener"><i class="fab fa-facebook-f"></i> Facebook</a>' +
        '<a href="https://twitter.com/intent/tweet?url=' + url + '&text=' + title + '" class="post-share-btn twitter" target="_blank" rel="noopener"><i class="fab fa-twitter"></i> Twitter</a>' +
        '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + url + '" class="post-share-btn linkedin" target="_blank" rel="noopener"><i class="fab fa-linkedin-in"></i> LinkedIn</a>' +
        '<a href="mailto:?subject=' + title + '&body=' + text + '%0A%0ARead more: ' + url + '" class="post-share-btn email"><i class="fas fa-envelope"></i> Email</a>' +
        '<button class="post-share-btn copy" onclick="copyPostUrl(\'' + post.url + '\')"><i class="fas fa-link"></i> Copy Link</button>'
    );
}

function copyPostUrl(url) {
    navigator.clipboard.writeText(url);
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    if (modal) modal.remove();
}

function bindModalDismiss() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePostModal();
    });
}
