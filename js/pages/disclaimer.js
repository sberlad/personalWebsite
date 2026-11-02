// Scripts for disclaimer.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

// Builds the Impressum email at render time instead of embedding it as plain
// text/mailto in the HTML source, so static scrapers (most spam harvesters)
// never see it, while real visitors get a normal working mailto: link.
document.addEventListener('DOMContentLoaded', function () {
    const el = document.getElementById('impressum-email');
    if (!el) return;
    const user = 'contact';
    const domain = 'samuelberlad.com';
    const address = user + '@' + domain;
    const link = document.createElement('a');
    link.href = 'mailto:' + address;
    link.textContent = address;
    el.textContent = '';
    el.appendChild(link);
});
