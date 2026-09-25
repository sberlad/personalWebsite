// Cookie/privacy consent, loaded on every page.
//
// Nothing that isn't strictly necessary loads until the visitor says yes:
// Google Analytics only loads after "analytics" is accepted, and YouTube
// embeds (see js/pages/videos.js) only load after "embeds" is accepted or
// the visitor clicks a specific video (which counts as consent for that
// one embed). The choice is stored in localStorage and can be changed any
// time via the "Cookie settings" link in the footer.

const CONSENT_KEY = 'cookieConsent';
const GA_MEASUREMENT_ID = 'G-K1KBWVNTC4';

function getConsent() {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null; // private browsing / storage blocked: treat as "not decided"
    }
}

function saveConsent(analytics, embeds) {
    const consent = { decided: true, analytics: !!analytics, embeds: !!embeds };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch (e) { /* ignore */ }
    apply(consent);
    hideBanner();
    return consent;
}

function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
}

function apply(consent) {
    window.__embedsConsent = !!consent.embeds;
    if (consent.analytics) loadAnalytics();
    document.dispatchEvent(new CustomEvent('consentchange', { detail: consent }));
}

// Called by a video facade when someone clicks play without prior embed
// consent: that click is itself the affirmative action, so it grants embed
// consent (and only embed consent — analytics stays whatever it already was).
function grantEmbedsConsent() {
    const existing = getConsent() || { decided: true, analytics: false, embeds: false };
    return saveConsent(existing.analytics, true);
}
window.grantEmbedsConsent = grantEmbedsConsent;

// ---- Banner UI --------------------------------------------------------

function buildBanner() {
    const el = document.createElement('div');
    el.id = 'cookieBanner';
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie preferences');
    el.innerHTML =
        '<div class="cookie-banner-content">' +
            '<p class="cookie-banner-text">This site uses cookies for analytics and to play embedded YouTube and SoundCloud content. ' +
                'Nothing beyond what your browser sends by default loads until you choose. ' +
                '<a href="disclaimer.html#cookies">Details</a>.</p>' +
            '<div class="cookie-banner-buttons">' +
                '<button type="button" class="cookie-btn cookie-btn-secondary" id="cookieRejectAll">Reject all</button>' +
                '<button type="button" class="cookie-btn cookie-btn-secondary" id="cookieCustomize">Customize</button>' +
                '<button type="button" class="cookie-btn cookie-btn-primary" id="cookieAcceptAll">Accept all</button>' +
            '</div>' +
            '<div class="cookie-panel" id="cookiePanel" hidden>' +
                '<label class="cookie-toggle-row"><input type="checkbox" checked disabled> Essential — none currently used, always on</label>' +
                '<label class="cookie-toggle-row"><input type="checkbox" id="cookieToggleAnalytics"> Analytics (Google Analytics)</label>' +
                '<label class="cookie-toggle-row"><input type="checkbox" id="cookieToggleEmbeds"> Embedded content (YouTube, SoundCloud)</label>' +
                '<button type="button" class="cookie-btn cookie-btn-primary" id="cookieSavePrefs">Save preferences</button>' +
            '</div>' +
        '</div>';
    return el;
}

function showBanner(prefill) {
    let el = document.getElementById('cookieBanner');
    if (!el) {
        el = buildBanner();
        document.body.appendChild(el);

        document.getElementById('cookieAcceptAll').addEventListener('click', function () { saveConsent(true, true); });
        document.getElementById('cookieRejectAll').addEventListener('click', function () { saveConsent(false, false); });
        document.getElementById('cookieCustomize').addEventListener('click', function () {
            document.getElementById('cookiePanel').hidden = false;
        });
        document.getElementById('cookieSavePrefs').addEventListener('click', function () {
            saveConsent(
                document.getElementById('cookieToggleAnalytics').checked,
                document.getElementById('cookieToggleEmbeds').checked
            );
        });
    }
    if (prefill) {
        document.getElementById('cookieToggleAnalytics').checked = !!prefill.analytics;
        document.getElementById('cookieToggleEmbeds').checked = !!prefill.embeds;
        document.getElementById('cookiePanel').hidden = false;
    }
    el.hidden = false;
}

function hideBanner() {
    const el = document.getElementById('cookieBanner');
    if (el) el.hidden = true;
}

// Reopens the banner, pre-filled with the current choice, so it works as a
// "change your mind" settings screen too. Exposed for the footer link.
function openCookieSettings() {
    showBanner(getConsent() || { analytics: false, embeds: false });
}
window.openCookieSettings = openCookieSettings;

// ---- Init ---------------------------------------------------------------

const consent = getConsent();
if (consent && consent.decided) {
    apply(consent);
} else {
    showBanner();
}
