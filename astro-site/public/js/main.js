// Shared behaviour for every page that has the site header.
// Loaded at the end of <body>, so the page's elements already exist.

// Mobile menu
(function () {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('hamburger-open');
        nav.classList.toggle('nav-open');
    });

    // Close the menu when a link is chosen
    document.querySelectorAll('.nav_item a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('hamburger-open');
            nav.classList.remove('nav-open');
        });
    });
})();

// Red underline under the header once the page is scrolled
(function () {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.pageYOffset > 100);
    });
})();

// Scroll-to-top button (only on pages that have one)
(function () {
    const scrollButton = document.getElementById('scrolltotop_parent');
    if (!scrollButton) return;

    window.addEventListener('scroll', function () {
        scrollButton.style.display = window.pageYOffset > 500 ? 'flex' : 'none';
    });

    scrollButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Footer copyright year
document.querySelectorAll('.copyright-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
});
