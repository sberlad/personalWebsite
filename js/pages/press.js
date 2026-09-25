// Scripts for press.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

document.addEventListener('DOMContentLoaded', function () {
    loadQuotes();
});

async function loadQuotes() {
    try {
        const response = await fetch('./press-quotes.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        renderQuotes(data.quotes || []);
    } catch (error) {
        console.error('Error loading press-quotes.json:', error);
        const list = document.getElementById('quotesList');
        if (list) list.innerHTML =
            '<p style="text-align:center; color:var(--light-gray); padding:3rem 1rem;">Press quotes are temporarily unavailable.</p>';
    }
}

function formatDate(yyyyMm) {
    if (!yyyyMm) return '';
    const [year, month] = yyyyMm.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function renderQuotes(quotes) {
    const list = document.getElementById('quotesList');
    if (!list) return;

    list.innerHTML = quotes.map(function (q) {
        const isRtl = q.language === 'he';
        const hasTranslation = !!q.translation;
        const sourceLine = [q.critic, q.publication].filter(Boolean).join(', ');
        const productionLine = [q.production, q.venue].filter(Boolean).join(' · ');

        return (
            '<blockquote class="press-quote">' +
                '<p class="press-quote-text' + (isRtl ? ' rtl' : '') + '">' + q.text + '</p>' +
                (hasTranslation ? '<p class="press-quote-translation">' + q.translation + '</p>' : '') +
                '<footer class="press-quote-meta">' +
                    '<cite class="press-quote-source">' + sourceLine + '</cite>' +
                    '<span class="press-quote-production">' + productionLine + (q.date ? ' · ' + formatDate(q.date) : '') + '</span>' +
                '</footer>' +
            '</blockquote>'
        );
    }).join('');
}
