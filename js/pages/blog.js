// Scripts for blog.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

// Blog posts data - fallback if JSON doesn't load
const fallbackBlogPosts = [
    {
        id: 1,
        title: "Becoming Wagner's Alberich: The Challenge of Power and Restraint",
        excerpt: "Preparing Wagner's cunning Nibelung dwarf at Harztheater revealed unexpected vocal and dramatic challenges. From mastering the Coburger Fassung's reduced orchestration to embodying psychological complexity on stage, Alberich demands far more than Wagnerian power—it requires technical precision, emotional vulnerability, and the courage to find humanity in opera's most demanding villain roles.",
        content: "Loading full content...",
        date: "2024-05-15",
        category: "opera",
        image: "images/blog/becomingWagnersAlberich.jpg",
        featured: true,
        tags: ["Wagner", "Alberich", "Das Rheingold", "character preparation", "Harztheater", "bass-baritone", "vocal technique"]
    },
    {
        id: 2,
        title: "From Shul to Stage: Breathing Together in Chazzanut and Opera",
        excerpt: "How cantorial prayer and operatic performance share the same breath, technique, and spiritual foundation. From Thomas Heyer's teachings on voice as 'vessel of the soul' to leading Yom Kippur services and singing Mozart, discover why sacred and secular music traditions strengthen each other rather than compete—and how physiological empathy connects performer and audience through shared breathing.",
        content: "Loading full content...",
        date: "2024-10-31",
        category: "chazzanut",
        image: "images/blog/fromShulToStage.jpg",
        featured: false,
        tags: ["chazzanut", "opera", "vocal technique", "sacred music", "spiritual connection", "Thomas Heyer", "Naftali Herstik ז\"ל"]
    },
    {
        id: 3,
        title: "Letters from the Stage: What Singers Wish Conductors and Theater Managers Knew",
        excerpt: "An open letter addressing the hidden challenges opera singers face in rehearsal rooms worldwide. Seven practical insights on vocal health, emotional safety, audition feedback, and creating collaborative environments where artists can take risks. Essential reading for conductors, directors, and theater administrators who want to understand what singers truly need to deliver their best performances.",
        content: "Loading full content...",
        date: "2025-06-11",
        category: "career",
        image: "images/blog/whatSingersWishManagersKnew.jpg",
        featured: false,
        tags: ["opera career", "singer experience", "rehearsal culture", "artistic collaboration", "professional development", "conductor relations", "audition process", "vocal health"]
    }
];

// Global variables
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let postsPerPage = 6;
let currentCategory = 'all';
let currentSearch = '';

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing blog...');
    initializeBlog();
});

function initializeBlog() {
    console.log('Starting blog initialization...');
    loadBlogPosts().then(() => {
        // Check for direct post links after posts are loaded
        checkForDirectPostLink();
    });
    bindEvents();
    console.log('Blog initialization complete');
}

async function loadBlogPosts() {
    try {
        console.log('Attempting to load blog-posts.json...');
        const response = await fetch('./blog-posts.json');
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('JSON data loaded:', data);
        allPosts = data.posts || [];
        console.log('Posts loaded from JSON:', allPosts.length);

        // Ensure posts have full content with links
        if (allPosts.length > 0 && allPosts[0].content && allPosts[0].content.includes('<a href')) {
            console.log('✅ JSON loaded successfully with full content and links');
        } else {
            console.log('⚠️ JSON content appears incomplete, using fallback');
            throw new Error('JSON content incomplete');
        }

    } catch (error) {
        console.error('Error loading posts from JSON:', error);
        console.log('Using fallback sample data');
        allPosts = fallbackBlogPosts;
    }

    if (allPosts.length === 0) {
        console.log('No posts found, loading fallback data');
        allPosts = fallbackBlogPosts;
    }

    filterAndRender();

    // Return promise to allow chaining
    return Promise.resolve();
}

function bindEvents() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.toLowerCase();
            currentPage = 1;
            filterAndRender();
        });
    }

    // Category filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            currentPage = 1;
            filterAndRender();
        });
    });

    // Handle browser back/forward buttons  
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.postId) {
            // User navigated to a post
            const post = allPosts.find(p => p.id == e.state.postId);
            if (post) {
                showPostModal(post);
            }
        } else {
            // User navigated back to blog page
            closePostModal();
        }
    });
}

function filterAndRender() {
    console.log('Filtering posts. Total posts:', allPosts.length);
    console.log('Current category:', currentCategory);
    console.log('Current search:', currentSearch);

    filteredPosts = allPosts.filter(function(post) {
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        const matchesSearch = currentSearch === '' || 
            post.title.toLowerCase().includes(currentSearch) ||
            post.excerpt.toLowerCase().includes(currentSearch) ||
            post.tags.some(tag => tag.toLowerCase().includes(currentSearch));

        return matchesCategory && matchesSearch;
    });

    console.log('Filtered posts:', filteredPosts.length);
    renderPosts();
}

function renderPosts() {
    console.log('Rendering posts. Filtered posts:', filteredPosts.length);
    const blogGrid = document.getElementById('blogGrid');
    const noResults = document.getElementById('noResults');

    if (filteredPosts.length === 0) {
        console.log('No posts to display');
        if (blogGrid) blogGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    const postsToShow = filteredPosts;

    let html = '';

    postsToShow.forEach(function(post, index) {
        if (post.featured && index === 0) {
            html += renderFeaturedPost(post);
        } else {
            html += renderRegularPost(post);
        }
    });

    if (blogGrid) {
        blogGrid.innerHTML = html;
        bindPostEvents();
    }
}

function renderFeaturedPost(post) {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <article class="featured-post blog-card" data-id="${post.id}">
            <div class="featured-image" style="background-image: url('${post.image}')">
                <div class="featured-label">Featured</div>
            </div>
            <div class="featured-content">
                <div class="featured-category">${post.category}</div>
                <h2 class="featured-title">${post.title}</h2>
                <p class="featured-excerpt">${post.excerpt}</p>
                <div class="featured-meta">${date}</div>
                <a href="#" class="read-more">Read Full Post</a>
            </div>
        </article>
    `;
}

function renderRegularPost(post) {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <article class="blog-card" data-id="${post.id}">
            <div class="blog-image" style="background-image: url('${post.image}')">
                <div class="blog-category">${post.category}</div>
            </div>
            <div class="blog-content">
                <div class="blog-date">${date}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="read-more">Read More</a>
            </div>
        </article>
    `;
}

function bindPostEvents() {
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(function(card) {
        // Make entire card clickable
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = card.dataset.id;
            openPost(postId);
        });

        // Also handle read-more links specifically
        const readMoreLink = card.querySelector('.read-more');
        if (readMoreLink) {
            readMoreLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const postId = card.dataset.id;
                openPost(postId);
            });
        }
    });
}

function openPost(postId) {
    const post = allPosts.find(function(p) { return p.id == postId; });
    if (post) {
        // Create a modal with the full post content
        showPostModal(post);
    }
}

function showPostModal(post) {
    // Remove existing modal if any
    const existingModal = document.getElementById('postModal');
    if (existingModal) {
        existingModal.remove();
    }

    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update browser URL for sharing
    const postUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    window.history.pushState({postId: post.id}, post.title, postUrl);

    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'postModal';
    modal.className = 'post-modal';
    modal.style.display = 'flex';

    modal.innerHTML = `
        <div class="post-modal-content">
            <div class="post-modal-header">
                <button class="close-modal" onclick="closePostModal()">&times;</button>
            </div>
            <div class="post-modal-body">
                <div class="post-category">${post.category}</div>
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">${date}</div>

                <div class="post-image-container" style="margin: 2rem 0;">
                    <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 300px; object-fit: cover; border: 1px solid rgba(164, 32, 32, 0.3);">
                </div>

                <div class="post-social-share">
                    <h4>Share This Post</h4>
                    <div class="post-share-buttons">
                        <a href="#" class="post-share-btn facebook" onclick="sharePost('facebook', '${post.id}'); return false;">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </a>
                        <a href="#" class="post-share-btn twitter" onclick="sharePost('twitter', '${post.id}'); return false;">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="#" class="post-share-btn linkedin" onclick="sharePost('linkedin', '${post.id}'); return false;">
                            <i class="fab fa-linkedin-in"></i> LinkedIn
                        </a>
                        <a href="#" class="post-share-btn email" onclick="sharePost('email', '${post.id}'); return false;">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                        <button class="post-share-btn copy" onclick="copyPostUrl('${post.id}')">
                            <i class="fas fa-link"></i> Copy Link
                        </button>
                    </div>
                </div>

                <div class="post-content"></div>

                <div class="post-social-share" style="margin-top: 2rem;">
                    <h4>Enjoyed this post? Share it!</h4>
                    <div class="post-share-buttons">
                        <a href="#" class="post-share-btn facebook" onclick="sharePost('facebook', '${post.id}'); return false;">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </a>
                        <a href="#" class="post-share-btn twitter" onclick="sharePost('twitter', '${post.id}'); return false;">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="#" class="post-share-btn linkedin" onclick="sharePost('linkedin', '${post.id}'); return false;">
                            <i class="fab fa-linkedin-in"></i> LinkedIn
                        </a>
                        <a href="#" class="post-share-btn email" onclick="sharePost('email', '${post.id}'); return false;">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                        <button class="post-share-btn copy" onclick="copyPostUrl('${post.id}')">
                            <i class="fas fa-link"></i> Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Set the HTML content (this preserves links and formatting)
    const contentDiv = modal.querySelector('.post-content');
    contentDiv.innerHTML = post.content;

    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePostModal();
        }
    });

    // Close on escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closePostModal();
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Store the handler so we can remove it later
    modal.escapeHandler = escapeHandler;
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    if (modal) {
        // Remove escape key handler
        if (modal.escapeHandler) {
            document.removeEventListener('keydown', modal.escapeHandler);
        }
        modal.remove();

        // Reset URL to blog page
        window.history.pushState({}, 'Samuel Berlad Blog', window.location.pathname);
    }
}

function sharePost(platform, postId) {
    const post = allPosts.find(p => p.id == postId);
    if (!post) return;

    const postUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(`${post.title} - ${post.excerpt.substring(0, 100)}...`);

    let shareUrl = '';

    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%0A%0ARead more: ${encodeURIComponent(postUrl)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

function copyPostUrl(postId) {
    const postUrl = `${window.location.origin}${window.location.pathname}#post-${postId}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(postUrl).then(() => {
            showShareFeedback('Link copied to clipboard!');
        }).catch(() => {
            fallbackCopyToClipboard(postUrl);
        });
    } else {
        fallbackCopyToClipboard(postUrl);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showShareFeedback('Link copied!');
}

function showShareFeedback(message) {
    // Remove existing feedback
    const existingFeedback = document.getElementById('shareFeedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.id = 'shareFeedback';
    feedback.className = 'share-feedback';
    feedback.textContent = message;

    document.body.appendChild(feedback);

    // Show feedback
    setTimeout(() => {
        feedback.classList.add('show');
    }, 100);

    // Hide feedback after 3 seconds
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 3000);
}

// Check for direct post links on page load
function checkForDirectPostLink() {
    const hash = window.location.hash;
    if (hash.startsWith('#post-')) {
        const postId = hash.replace('#post-', '');
        const post = allPosts.find(p => p.id == postId);
        if (post) {
            // Wait a bit for posts to load, then open the modal
            setTimeout(() => {
                openPost(postId);
            }, 100);
        }
    }
}
