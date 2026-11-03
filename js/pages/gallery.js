// Scripts for gallery.html only. Shared behaviour (menu, header, footer year) is in js/main.js.
//
// Productions come from gallery-photos.json. The page shows one tile per
// production; clicking a tile opens a lightbox showing just that
// production's photos, with prev/next between them.

let allProductions = [];
let filteredProductions = [];
let activeProduction = null;
let activePhotoIndex = 0;

const GENRE_LABELS = {
    opera: 'Opera',
    operetta: 'Operetta',
    musical: 'Musical Theater',
    concert: 'Concert',
    oratorio: 'Oratorio',
    recital: 'Recital',
};

document.addEventListener('DOMContentLoaded', function () {
    loadProductions();
    bindLightboxControls();
    bindFilterControls();
});

async function loadProductions() {
    try {
        const response = await fetch('./gallery-photos.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        allProductions = (data.productions || []).slice().sort(function (a, b) {
            return Number(b.year) - Number(a.year);
        });
        filteredProductions = allProductions;
        populateFilterOptions();
        renderGrid();
    } catch (error) {
        console.error('Error loading gallery-photos.json:', error);
        const grid = document.getElementById('productionGrid');
        if (grid) grid.innerHTML =
            '<p style="grid-column:1/-1; text-align:center; color:var(--light-gray); padding:3rem 1rem;">The gallery is temporarily unavailable.</p>';
    }
}

// ── Filters ──────────────────────────────────────────────────────────
function populateFilterOptions() {
    const years = [...new Set(allProductions.map(function (p) { return p.year; }))]
        .sort(function (a, b) { return Number(b) - Number(a); });
    const venues = [...new Set(allProductions.map(function (p) { return p.venue; }))].sort();
    const genres = [...new Set(allProductions.map(function (p) { return p.genre; }).filter(Boolean))]
        .sort(function (a, b) { return (GENRE_LABELS[a] || a).localeCompare(GENRE_LABELS[b] || b); });

    appendOptions('yearFilter', years, function (y) { return y; });
    appendOptions('venueFilter', venues, function (v) { return v; });
    appendOptions('genreFilter', genres, function (g) { return GENRE_LABELS[g] || g; });
}

function appendOptions(selectId, values, labelFor) {
    const select = document.getElementById(selectId);
    if (!select) return;
    values.forEach(function (value) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = labelFor(value);
        select.appendChild(option);
    });
}

function bindFilterControls() {
    ['yearFilter', 'venueFilter', 'genreFilter'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const year = document.getElementById('yearFilter').value;
    const venue = document.getElementById('venueFilter').value;
    const genre = document.getElementById('genreFilter').value;

    filteredProductions = allProductions.filter(function (p) {
        return (year === 'all' || p.year === year) &&
               (venue === 'all' || p.venue === venue) &&
               (genre === 'all' || p.genre === genre);
    });
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('productionGrid');
    const noResults = document.getElementById('galleryNoResults');
    if (!grid) return;

    if (filteredProductions.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.hidden = false;
        return;
    }
    if (noResults) noResults.hidden = true;

    grid.innerHTML = filteredProductions.map(function (production, index) {
        const cover = production.photos[0];
        return (
            '<div class="production-tile" data-index="' + index + '">' +
                '<img src="' + cover.src + '" loading="lazy" alt="' + cover.alt + '">' +
                (production.photos.length > 1
                    ? '<div class="production-tile-count"><i class="fas fa-images"></i> ' + production.photos.length + '</div>'
                    : '') +
                '<div class="production-tile-info">' +
                    '<div class="production-tile-opera">' + production.composer + ': ' + production.opera + '</div>' +
                    '<div class="production-tile-role">' + production.title + '</div>' +
                    '<div class="production-tile-meta">' + production.venue + ', ' + production.year + '</div>' +
                '</div>' +
            '</div>'
        );
    }).join('');

    grid.querySelectorAll('.production-tile').forEach(function (tile) {
        tile.addEventListener('click', function () { openLightbox(+tile.dataset.index, 0); });
    });
}

function openLightbox(productionIndex, photoIndex) {
    activeProduction = filteredProductions[productionIndex];
    activePhotoIndex = photoIndex;
    document.getElementById('lightbox').hidden = false;
    document.body.style.overflow = 'hidden';
    showPhoto();
}

function closeLightbox() {
    document.getElementById('lightbox').hidden = true;
    document.body.style.overflow = '';
    activeProduction = null;
}

function showPhoto() {
    if (!activeProduction) return;
    const photo = activeProduction.photos[activePhotoIndex];
    const image = document.getElementById('lightboxImage');
    image.src = photo.src;
    image.alt = photo.alt;
    document.getElementById('lightboxDescription').textContent =
        activeProduction.composer + ': ' + activeProduction.opera + ' — ' + activeProduction.title + ', ' + activeProduction.venue + ' ' + activeProduction.year;
    document.getElementById('lightboxCredit').textContent = activeProduction.photographer ? 'Photo by: ' + activeProduction.photographer : '';

    const count = document.getElementById('lightboxCount');
    const multi = activeProduction.photos.length > 1;
    count.textContent = multi ? (activePhotoIndex + 1) + ' / ' + activeProduction.photos.length : '';
    document.getElementById('lightboxPrev').style.visibility = multi ? 'visible' : 'hidden';
    document.getElementById('lightboxNext').style.visibility = multi ? 'visible' : 'hidden';
}

function showRelativePhoto(delta) {
    if (!activeProduction) return;
    const total = activeProduction.photos.length;
    activePhotoIndex = (activePhotoIndex + delta + total) % total;
    showPhoto();
}

function bindLightboxControls() {
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', function () { showRelativePhoto(-1); });
    document.getElementById('lightboxNext').addEventListener('click', function () { showRelativePhoto(1); });

    document.getElementById('lightbox').addEventListener('click', function (e) {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!activeProduction) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showRelativePhoto(-1);
        else if (e.key === 'ArrowRight') showRelativePhoto(1);
    });

    // Touch swipe between a production's own photos
    let startX = 0;
    const content = document.querySelector('.lightbox-content');
    content.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    content.addEventListener('touchend', function (e) {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) showRelativePhoto(diff > 0 ? 1 : -1);
    }, { passive: true });
}
