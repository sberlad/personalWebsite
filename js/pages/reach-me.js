// "Save to Contacts" button: downloads a vCard.
// Lines are joined explicitly because a vCard line that starts with a space
// is read as a continuation of the previous line.
function downloadVCard() {
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Samuel Berlad',
        'N:Berlad;Samuel;;;',
        'ORG:Professional Bass-Baritone',
        'TITLE:Opera Singer',
        'EMAIL:contact@samuelberlad.com',
        'TEL;TYPE=WORK:+49-176-62566823',
        'TEL;TYPE=WORK:+972-53-429-6543',
        'URL:https://samuelberlad.com',
        'ADR;TYPE=WORK:;;Germany;;',
        'ADR;TYPE=WORK:;;Israel;;',
        'NOTE:Professional Bass-Baritone specializing in Opera, Concert, Chazzan services, and Vocal Pedagogy (Dipl. IGP). Based in Germany and Israel. Available for international engagements.',
        'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Samuel_Berlad_Contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
