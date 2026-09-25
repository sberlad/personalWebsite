// Scripts for index.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

// Global variables
let allRoles = [];

// Quote rotation functionality
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote-text');

function rotateQuotes() {
    quotes[currentQuote].classList.remove('active');
    currentQuote = (currentQuote + 1) % quotes.length;
    setTimeout(() => {
        quotes[currentQuote].classList.add('active');
    }, 250);
}

// Start rotation after initial load
setTimeout(() => {
    setInterval(rotateQuotes, 6000);
}, 4000);

// Initialize current season when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
});

async function initializeHomepage() {
    await loadCurrentSeason();
}

async function loadCurrentSeason() {
    try {
        const response = await fetch('./roles-database.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        allRoles = data.roles || [];
        renderCurrentSeason();
    } catch (error) {
        console.error('Error loading roles-database.json:', error);
        renderError();
    }
}

function renderError() {
    const loadingElement = document.getElementById('venuesLoading');
    const gridElement = document.getElementById('currentSeasonGrid');
    if (loadingElement) loadingElement.style.display = 'none';
    if (gridElement) gridElement.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem 1rem; color:var(--light-gray);">
            <p style="font-family:'Playfair Display',serif; font-size:1.2rem; color:var(--off-white); margin-bottom:1rem;">
                The season listing is temporarily unavailable.
            </p>
            <p>Please <a href="reach-me.html" style="color:var(--primary-red); text-decoration:none;">contact me directly</a> for current performance details.</p>
        </div>`;
}

function renderCurrentSeason() {
    const loadingElement = document.getElementById('venuesLoading');
    const gridElement = document.getElementById('currentSeasonGrid');

    if (loadingElement) loadingElement.style.display = 'none';

    // Show: current + upcoming always; past only if featured and year >= 2024
    const displayRoles = allRoles
        .filter(function(role) {
            if (role.status === 'current' || role.status === 'upcoming') return true;
            if (role.status === 'past' && role.featured && parseInt(role.year) >= 2024) return true;
            return false;
        })
        .sort(function(a, b) {
            const priority = { upcoming: 3, current: 2, past: 1 };
            const pDiff = (priority[b.status] || 0) - (priority[a.status] || 0);
            if (pDiff !== 0) return pDiff;
            if (a.featured !== b.featured) return a.featured ? -1 : 1;
            return parseInt(b.year) - parseInt(a.year);
        })
        .slice(0, 6);

    if (gridElement) {
        gridElement.innerHTML = displayRoles.map(function(role) {
            const showBadge = role.status === 'upcoming' || role.status === 'current';
            const showTeam = role.director && role.director !== 'Concert Performance' && role.director !== 'Recital' && role.director !== 'Broadcast';
            return `
                <div class="venue-card ${role.featured ? 'featured' : ''}" onclick="window.location.href='repertoire.html'" style="cursor:pointer">
                    ${showBadge ? `<div class="status-badge ${role.status}">${role.status}</div>` : ''}
                    <h3 class="venue-role">${role.role}</h3>
                    <p class="venue-opera">${role.opera}</p>
                    <p class="venue-composer">${role.composer}</p>
                    ${role.description ? `<p class="role-description">${role.description}</p>` : ''}
                    <p class="venue-name">${role.venue}</p>
                    <p class="venue-location">${role.location}</p>
                    ${showTeam ? `<p class="venue-details">${[role.director, role.conductor].filter(Boolean).join(' | ')}</p>` : ''}
                </div>
            `;
        }).join('');
    }
}
