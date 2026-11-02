// Scripts for videos.html only. Shared behaviour (menu, header, footer year) is in js/main.js.
//
// Every embed here (YouTube, SoundCloud) is a click-to-load facade: nothing
// from either third party loads until the visitor clicks play. YouTube loads
// from youtube-nocookie.com, which doesn't set a tracking cookie until
// playback actually starts. Clicking play is itself the affirmative action
// that grants "embedded content" consent (see js/consent.js) if it wasn't
// already given via the cookie banner.

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.video-facade').forEach(function (facade) {
        facade.addEventListener('click', function () { loadEmbed(facade); });
    });
});

function loadEmbed(facade) {
    if (!window.__embedsConsent && window.grantEmbedsConsent) {
        window.grantEmbedsConsent();
    }

    const title = facade.dataset.title || '';
    const iframe = document.createElement('iframe');
    iframe.title = title;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');

    if (facade.dataset.embed === 'youtube') {
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + facade.dataset.id + '?autoplay=1';
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    } else {
        const base = facade.dataset.src;
        iframe.src = base + (base.indexOf('?') > -1 ? '&' : '?') + 'auto_play=true';
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allow', 'autoplay');
    }

    facade.replaceWith(iframe);
}
