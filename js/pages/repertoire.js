// Scripts for repertoire.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

let allRoles = [];
let filteredRoles = [];

const HARZTHEATER_SPIELPLAN_URL = 'https://harztheater.de/spielplan';

// Where to find dates/tickets for a role, or '' if there isn't one to show.
// Harztheater's own schedule page never needs updating here as seasons change,
// so any current/upcoming Harztheater role gets it automatically with no data
// entry required. A role can also set its own "ticketUrl" for a one-off
// engagement elsewhere.
function getTicketUrl(role) {
    if (role.ticketUrl) return role.ticketUrl;
    const isCurrentOrUpcoming = role.status === 'current' || role.status === 'upcoming';
    if (isCurrentOrUpcoming && role.venue === 'Harztheater') return HARZTHEATER_SPIELPLAN_URL;
    return '';
}

// ── Fetch from roles-database.json ──────────────────────────────────
async function loadRoles() {
    try {
        const response = await fetch('./roles-database.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        allRoles = data.roles || [];
        filteredRoles = [...allRoles];
        renderRoles(filteredRoles);
    } catch (err) {
        console.error('Could not load roles-database.json:', err);
        renderError();
    }
}

function renderError() {
    const grid = document.getElementById('rolesGrid');
    if (grid) grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:4rem 1rem; color:var(--light-gray);">
            <p style="font-family:'Playfair Display',serif; font-size:1.2rem; color:var(--off-white); margin-bottom:1rem;">
                The repertoire list is temporarily unavailable.
            </p>
            <p>Please <a href="reach-me.html" style="color:var(--primary-red); text-decoration:none;">contact me directly</a> for details — I apologise for the inconvenience.</p>
        </div>`;
}

// ── Render ───────────────────────────────────────────────────────────
function renderRoles(data) {
    const grid = document.getElementById('rolesGrid');
    const noResults = document.getElementById('noResults');

    if (data.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    grid.innerHTML = data.map(function(role) {
        const showBadge  = role.status === 'current' || role.status === 'upcoming';
        const showTeam   = role.director &&
                           role.director !== 'Concert Performance' &&
                           role.director !== 'Recital' &&
                           role.director !== 'Broadcast';
        const teamString = showTeam
            ? (role.director && role.conductor ? role.director + ' | ' + role.conductor
               : role.director || role.conductor)
            : (role.conductor && role.conductor !== role.director ? role.conductor : '');

        return `
        <div class="role-card${role.featured ? ' featured-card' : ''}" data-type="${role.type}">
            ${showBadge ? `<div class="status-badge ${role.status}">${role.status}</div>` : ''}
            <div class="role-header">
                <div class="role-name">${role.role}</div>
                <div class="role-year">${role.year}</div>
            </div>
            <div class="opera-title">${role.opera}</div>
            <div class="composer">${role.composer}</div>
            ${role.description ? `<div class="role-description">${role.description}</div>` : ''}
            <div class="venue-info">
                <div class="venue-name">${role.venue}</div>
                <div class="venue-location">${role.location}</div>
                ${teamString ? `<div class="production-team">${teamString}</div>` : ''}
                ${getTicketUrl(role) ? `<a href="${getTicketUrl(role)}" class="ticket-link" target="_blank" rel="noopener">See dates &amp; tickets →</a>` : ''}
            </div>
        </div>`;
    }).join('');
}

// ── Filter & Search ──────────────────────────────────────────────────
function applyFilters() {
    const activeFilter = (document.querySelector('.filter-btn.active') || {}).dataset.filter || 'all';
    const searchTerm   = document.getElementById('searchInput').value.toLowerCase().trim();

    filteredRoles = allRoles.filter(function(role) {
        const matchType   = activeFilter === 'all' || role.type === activeFilter;
        const matchSearch = !searchTerm ||
            role.role.toLowerCase().includes(searchTerm) ||
            role.opera.toLowerCase().includes(searchTerm) ||
            role.composer.toLowerCase().includes(searchTerm) ||
            role.venue.toLowerCase().includes(searchTerm) ||
            role.location.toLowerCase().includes(searchTerm);
        return matchType && matchSearch;
    });

    renderRoles(filteredRoles);
}

// ── Responsive filter buttons vs dropdown ────────────────────────────
function checkFilterLayout() {
    const filtersContainer = document.querySelector('.filters');
    const dropdown         = document.querySelector('.filter-dropdown');
    filtersContainer.style.display = 'flex';
    dropdown.style.display = 'none';
    const buttons = filtersContainer.querySelectorAll('.filter-btn');
    if (buttons.length > 1) {
        const firstTop = buttons[0].offsetTop;
        const lastTop  = buttons[buttons.length - 1].offsetTop;
        if (firstTop !== lastTop) {
            filtersContainer.style.display = 'none';
            dropdown.style.display = 'block';
        }
    }
}

// ── Event listeners ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelector('.filter-btn.active').classList.remove('active');
            this.classList.add('active');
            applyFilters();
        });
    });

    // Dropdown fallback
    document.getElementById('filterSelect').addEventListener('change', function() {
        document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        const matching = document.querySelector(`.filter-btn[data-filter="${this.value}"]`);
        if (matching) matching.classList.add('active');
        applyFilters();
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // Load data
    loadRoles();
    checkFilterLayout();
    window.addEventListener('resize', checkFilterLayout);
});
