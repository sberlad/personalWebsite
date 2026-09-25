// Scripts for about.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

// Language switcher with updated biographies
const englishBio = `
<div class="bio-section">
    <p>Samuel Berlad is a bass-baritone and has been a member of the Harztheater ensemble in Halberstadt, Germany, since 2022.</p>
</div>

<div class="bio-section">
    <h2>Opera</h2>
    <p>His roles at Harztheater include Alberich in Wagner’s <em>Das Rheingold</em>, Hunding in <em>Die Walküre</em>, Vodník in Dvořák’s <em>Rusalka</em>, Schaunard in Puccini’s <em>La Bohème</em> and Bassa Selim in Mozart’s <em>Die Entführung aus dem Serail</em>. In <em>The Blues Brothers</em>, he has appeared as Curtis, James Brown and Ray Charles. His roles in the 2026/27 season are the Corporal/Count von Sandau in <em>Das Wirtshaus im Spessart</em>, Bartolo in Rossini’s <em>Il barbiere di Siviglia</em> and Alberich in Wagner’s <em>Siegfried</em>.</p>

    <p>His wider operatic repertoire includes Figaro in Mozart’s <em>Le nozze di Figaro</em>, Leporello in <em>Don Giovanni</em>, Collatinus in Britten’s <em>The Rape of Lucretia</em>, Escamillo in Bizet’s <em>Carmen</em>, Belcore in Donizetti’s <em>L’elisir d’amore</em> and Emperor Overall in Ullmann’s <em>Der Kaiser von Atlantis</em>. He has performed in opera and concert in Germany, Israel, France, Italy, the United Kingdom and the United States. In 2016, he was a Britten-Pears Young Artist at the Aldeburgh Festival.</p>
</div>

<div class="bio-section">
    <h2>Concerts &amp; Song</h2>
    <p>In 2024, Berlad gave the premiere of Dr. Ido Ariel’s Hebrew translation of Schubert’s complete song cycle <em>Die schöne Müllerin</em>. In 2021, he performed Schubert songs at the Israel Schubertiade. His song and concert repertoire ranges from Bach and Handel through Schubert, Schumann and Brahms to the twentieth century, and includes Handel’s <em>Messiah</em>, Bach’s <em>Weihnachtsoratorium</em>, Brahms’s <em>Ein deutsches Requiem</em> and Vaughan Williams’s <em>Songs of Travel</em>.</p>
</div>

<div class="bio-section">
    <h2>Israel</h2>
    <p>Berlad lived in Jerusalem from 2012 to 2022 and was active in Israel’s musical life throughout those years. He performed with Jerusalem Opera, Haifa Opera, the Israel Chamber Orchestra and Sinfonietta Beer Sheva, among others. Israel has also remained an important part of his work as a song recitalist.</p>
</div>

<div class="bio-section">
    <h2>Cantorial Work</h2>
    <p>Jewish liturgical music has been part of Berlad’s life since childhood. Alongside his opera and concert work, he continues to serve regularly as a cantor. He trained at the Tel Aviv Cantorial Institute, where his teachers included the late Naftali Herstik and Raymond Goldstein.</p>
</div>

<div class="bio-section">
    <h2>Education</h2>
    <p>Berlad holds a Diplom in Gesangspädagogik (vocal pedagogy) from the Wiesbadener Musikakademie / Hochschule für Musik und Darstellende Kunst Frankfurt and a Master of Music in Opera from the Hochschule für Musik und Darstellende Kunst Frankfurt.</p>
</div>
`;

const germanBio = `
<div class="bio-section">
    <p>Samuel Berlad ist Bassbariton und seit 2022 Ensemblemitglied des Harztheaters in Halberstadt.</p>
</div>

<div class="bio-section">
    <h2>Oper</h2>
    <p>Zu seinen Partien am Haus zählen Alberich in Wagners <em>Das Rheingold</em>, Hunding in <em>Die Walküre</em>, Vodník in Dvořáks <em>Rusalka</em>, Schaunard in Puccinis <em>La Bohème</em> und Bassa Selim in Mozarts <em>Die Entführung aus dem Serail</em>. In <em>The Blues Brothers</em> war er als Curtis sowie als James Brown und Ray Charles zu erleben. In der Spielzeit 2026/27 übernimmt er den Korporal/Grafen von Sandau in <em>Das Wirtshaus im Spessart</em>, Bartolo in Rossinis <em>Il barbiere di Siviglia</em> und Alberich in Wagners <em>Siegfried</em>.</p>

    <p>Sein weiteres Opernrepertoire umfasst Figaro in Mozarts <em>Le nozze di Figaro</em>, Leporello in <em>Don Giovanni</em>, Collatinus in Brittens <em>The Rape of Lucretia</em>, Escamillo in Bizets <em>Carmen</em>, Belcore in Donizettis <em>L’elisir d’amore</em> und Kaiser Overall in Ullmanns <em>Der Kaiser von Atlantis</em>. Seine Arbeit führte ihn auf Opern- und Konzertbühnen in Deutschland, Israel, Frankreich, Italien, Großbritannien und den USA. 2016 war er Britten-Pears Young Artist beim Aldeburgh Festival.</p>
</div>

<div class="bio-section">
    <h2>Konzert &amp; Lied</h2>
    <p>2024 sang Berlad die Uraufführung der hebräischen Übertragung von Schuberts vollständigem Liederzyklus <em>Die schöne Müllerin</em> von Dr. Ido Ariel. Bereits 2021 war er mit Schubert-Liedern bei der Israel Schubertiade zu erleben. Sein Lied- und Konzertrepertoire reicht von Bach und Händel über Schubert, Schumann und Brahms bis ins 20. Jahrhundert und umfasst unter anderem Händels <em>Messiah</em>, Bachs <em>Weihnachtsoratorium</em>, Brahms’ <em>Ein deutsches Requiem</em> und Vaughan Williams’ <em>Songs of Travel</em>.</p>
</div>

<div class="bio-section">
    <h2>Israel</h2>
    <p>Von 2012 bis 2022 lebte Berlad in Jerusalem und war in diesen Jahren im israelischen Musikleben tätig. Er sang unter anderem mit der Jerusalem Opera, der Haifa Opera, dem Israel Chamber Orchestra und der Sinfonietta Beer Sheva. Israel blieb auch für seine Arbeit als Liedsänger von besonderer Bedeutung.</p>
</div>

<div class="bio-section">
    <h2>Kantorale Tätigkeit</h2>
    <p>Die jüdische liturgische Musik begleitet Berlad seit seiner Kindheit. Neben seiner Tätigkeit als Opern- und Konzertsänger ist er bis heute regelmäßig als Kantor tätig. Seine kantorale Ausbildung erhielt er am Tel Aviv Cantorial Institute, unter anderem bei Naftali Herstik s. A. und Raymond Goldstein.</p>
</div>

<div class="bio-section">
    <h2>Ausbildung</h2>
    <p>Berlad erwarb ein Diplom in Gesangspädagogik an der Wiesbadener Musikakademie / Hochschule für Musik und Darstellende Kunst Frankfurt sowie einen Master of Music im Fach Oper an der Hochschule für Musik und Darstellende Kunst Frankfurt.</p>
</div>
`;

const frenchBio = `
<div class="bio-section">
    <p>Le baryton-basse Samuel Berlad est membre de la troupe du Harztheater de Halberstadt, en Allemagne, depuis 2022.</p>
</div>

<div class="bio-section">
    <h2>Opéra</h2>
    <p>Il y a notamment interprété Alberich dans <em>Das Rheingold</em> et Hunding dans <em>Die Walküre</em> de Wagner, Vodník dans <em>Rusalka</em> de Dvořák, Schaunard dans <em>La Bohème</em> de Puccini et Bassa Selim dans <em>Die Entführung aus dem Serail</em> de Mozart. Dans <em>The Blues Brothers</em>, il a incarné Curtis, James Brown et Ray Charles. Pour la saison 2026/27, il interprète le Caporal/Comte von Sandau dans <em>Das Wirtshaus im Spessart</em>, Bartolo dans <em>Il barbiere di Siviglia</em> de Rossini et Alberich dans <em>Siegfried</em> de Wagner.</p>

    <p>Son répertoire lyrique comprend également Figaro dans <em>Le nozze di Figaro</em> et Leporello dans <em>Don Giovanni</em> de Mozart, Collatinus dans <em>The Rape of Lucretia</em> de Britten, Escamillo dans <em>Carmen</em> de Bizet, Belcore dans <em>L’elisir d’amore</em> de Donizetti et l’Empereur Overall dans <em>Der Kaiser von Atlantis</em> d’Ullmann. Il s’est produit à l’opéra et en concert en Allemagne, en Israël, en France, en Italie, au Royaume-Uni et aux États-Unis. En 2016, il a participé au festival d’Aldeburgh en tant que Britten-Pears Young Artist.</p>
</div>

<div class="bio-section">
    <h2>Concert &amp; récital</h2>
    <p>En 2024, Berlad a donné la première interprétation de la traduction hébraïque, réalisée par le Dr Ido Ariel, du cycle intégral <em>Die schöne Müllerin</em> de Schubert. En 2021, il avait chanté des lieder de Schubert à la Schubertiade d’Israël. Son répertoire de concert et de récital s’étend de Bach et Haendel au XXe siècle, en passant par Schubert, Schumann et Brahms. Il comprend notamment <em>Messiah</em> de Haendel, le <em>Weihnachtsoratorium</em> de Bach, <em>Ein deutsches Requiem</em> de Brahms et <em>Songs of Travel</em> de Vaughan Williams.</p>
</div>

<div class="bio-section">
    <h2>Israël</h2>
    <p>Berlad a vécu à Jérusalem de 2012 à 2022 et a participé à la vie musicale israélienne tout au long de cette période. Il a notamment chanté avec l’Opéra de Jérusalem, l’Opéra de Haïfa, l’Orchestre de chambre d’Israël et la Sinfonietta de Beer-Sheva. Israël conserve également une place importante dans son activité de récitaliste.</p>
</div>

<div class="bio-section">
    <h2>Chant synagogal</h2>
    <p>La musique liturgique juive accompagne Berlad depuis l’enfance. Parallèlement à ses activités à l’opéra et en concert, il exerce régulièrement comme chantre. Il s’est formé au Tel Aviv Cantorial Institute, notamment auprès de Naftali Herstik, de mémoire bénie, et de Raymond Goldstein.</p>
</div>

<div class="bio-section">
    <h2>Formation</h2>
    <p>Berlad est titulaire d’un Diplom en pédagogie du chant de la Wiesbadener Musikakademie / Hochschule für Musik und Darstellende Kunst de Francfort et d’un Master of Music en opéra de la Hochschule für Musik und Darstellende Kunst de Francfort.</p>
</div>
`;

const italianBio = `
<div class="bio-section">
    <p>Il basso-baritono Samuel Berlad fa parte dell’ensemble stabile dell’Harztheater di Halberstadt, in Germania, dal 2022.</p>
</div>

<div class="bio-section">
    <h2>Opera</h2>
    <p>In questo teatro ha interpretato Alberich in <em>Das Rheingold</em> e Hunding in <em>Die Walküre</em> di Wagner, Vodník in <em>Rusalka</em> di Dvořák, Schaunard in <em>La Bohème</em> di Puccini e Bassa Selim in <em>Die Entführung aus dem Serail</em> di Mozart. In <em>The Blues Brothers</em> ha vestito i panni di Curtis, James Brown e Ray Charles. Nella stagione 2026/27 interpreta il Caporale/Conte von Sandau in <em>Das Wirtshaus im Spessart</em>, Bartolo ne <em>Il barbiere di Siviglia</em> di Rossini e Alberich in <em>Siegfried</em> di Wagner.</p>

    <p>Il suo repertorio operistico comprende inoltre Figaro ne <em>Le nozze di Figaro</em> e Leporello in <em>Don Giovanni</em> di Mozart, Collatinus in <em>The Rape of Lucretia</em> di Britten, Escamillo in <em>Carmen</em> di Bizet, Belcore ne <em>L’elisir d’amore</em> di Donizetti e l’Imperatore Overall in <em>Der Kaiser von Atlantis</em> di Ullmann. Si è esibito in produzioni operistiche e concerti in Germania, Israele, Francia, Italia, Regno Unito e Stati Uniti. Nel 2016 ha partecipato al Festival di Aldeburgh come Britten-Pears Young Artist.</p>
</div>

<div class="bio-section">
    <h2>Concerti e Lied</h2>
    <p>Nel 2024 Berlad ha eseguito in prima assoluta la traduzione ebraica del dott. Ido Ariel dell’intero ciclo <em>Die schöne Müllerin</em> di Schubert. Nel 2021 aveva già cantato Lieder di Schubert alla Schubertiade d’Israele. Il suo repertorio vocale da camera e concertistico spazia da Bach e Händel al Novecento, passando per Schubert, Schumann e Brahms, e comprende <em>Messiah</em> di Händel, il <em>Weihnachtsoratorium</em> di Bach, <em>Ein deutsches Requiem</em> di Brahms e <em>Songs of Travel</em> di Vaughan Williams.</p>
</div>

<div class="bio-section">
    <h2>Israele</h2>
    <p>Dal 2012 al 2022 Berlad ha vissuto a Gerusalemme, partecipando alla vita musicale israeliana. Ha cantato, tra gli altri, con l’Opera di Gerusalemme, l’Opera di Haifa, l’Orchestra da Camera d’Israele e la Sinfonietta di Beer Sheva. Israele continua ad avere un ruolo importante anche nella sua attività liederistica.</p>
</div>

<div class="bio-section">
    <h2>Attività cantoriale</h2>
    <p>La musica liturgica ebraica accompagna Berlad fin dall’infanzia. Accanto all’attività operistica e concertistica, presta regolarmente servizio come cantore di sinagoga. Si è formato al Tel Aviv Cantorial Institute, dove ha studiato, tra gli altri, con Naftali Herstik, di benedetta memoria, e Raymond Goldstein.</p>
</div>

<div class="bio-section">
    <h2>Formazione</h2>
    <p>Berlad ha conseguito il Diplom in pedagogia del canto presso la Wiesbadener Musikakademie / Hochschule für Musik und Darstellende Kunst di Francoforte e il Master of Music in opera presso la Hochschule für Musik und Darstellende Kunst di Francoforte.</p>
</div>
`;

const hebrewBio = `
<div class="bio-section rtl">
    <p>זמר הבס־בריטון שמואל ברלד חבר באנסמבל הקבוע של תיאטרון הרץ בהלברשטאדט שבגרמניה מאז 2022.</p>
</div>

<div class="bio-section rtl">
    <h2>אופרה</h2>
    <p>בתיאטרון הרץ גילם בין השאר את אלבריך ב<em>זהב הריין</em> ואת הונדינג ב<em>הוולקירה</em> מאת וגנר, את וודניק ב<em>רוסלקה</em> מאת דבוז׳אק, את שונאר ב<em>לה בוהם</em> מאת פוצ׳יני ואת באסה סלים ב<em>החטיפה מן ההרמון</em> מאת מוצרט. ב<em>האחים בלוז</em> הופיע בתפקידי קרטיס, ג׳יימס בראון וריי צ׳ארלס. בעונת <bdi>2026/27</bdi> הוא מגלם את הקורפורל/הרוזן פון זנדאו ב<em>הפונדק בשפסארט</em>, את ברטולו ב<em>הספר מסביליה</em> מאת רוסיני ואת אלבריך ב<em>זיגפריד</em> מאת וגנר.</p>

    <p>הרפרטואר האופראי שלו כולל גם את פיגרו ב<em>נישואי פיגרו</em> ולפורלו ב<em>דון ג׳ובאני</em> מאת מוצרט, קולטינוס ב<em>אונס לוקרציה</em> מאת בריטן, אסקמיו ב<em>כרמן</em> מאת ביזה, בלקורה ב<em>שיקוי האהבה</em> מאת דוניצטי והקיסר אוברול ב<em>קיסר אטלנטיס</em> מאת אולמן. ברלד הופיע באופרות ובקונצרטים בגרמניה, בישראל, בצרפת, באיטליה, בבריטניה ובארצות הברית. ב־2016 השתתף בפסטיבל אלדבורו כאמן צעיר במסגרת תוכנית בריטן־פירס.</p>
</div>

<div class="bio-section rtl">
    <h2>קונצרטים וליד</h2>
    <p>ב־2024 שר ברלד בבכורה של תרגומו העברי של ד״ר עידו אריאל למחזור השירים המלא <em>הטוחנת היפה</em> מאת שוברט. ב־2021 ביצע שירים של שוברט בשוברטיאדה הישראלית. רפרטואר הליד והקונצרטים שלו משתרע מבאך והנדל, דרך שוברט, שומאן וברהמס, ועד המאה ה־20. בין היצירות ברפרטואר שלו: <em>משיח</em> מאת הנדל, <em>אורטוריית חג המולד</em> מאת באך, <em>רקוויאם גרמני</em> מאת ברהמס ו<em>שירי מסע</em> מאת ווהן ויליאמס.</p>
</div>

<div class="bio-section rtl">
    <h2>ישראל</h2>
    <p>בשנים <bdi>2012–2022</bdi> התגורר ברלד בירושלים והיה פעיל בחיי המוזיקה בישראל. הוא הופיע בין השאר עם האופרה ירושלים, האופרה חיפה, התזמורת הקאמרית הישראלית והסינפונייטה הישראלית באר שבע. ישראל מוסיפה לתפוס מקום חשוב גם בפעילותו בתחום הליד.</p>
</div>

<div class="bio-section rtl">
    <h2>חזנות</h2>
    <p>המוזיקה הליטורגית היהודית מלווה את ברלד מילדות. לצד עבודתו כזמר אופרה וקונצרטים, הוא ממשיך לשמש כחזן באופן קבוע. את הכשרתו בחזנות רכש במכון תל אביב לחזנות, בין השאר אצל נפתלי הרשטיק ז״ל וריימונד גולדשטיין.</p>
</div>

<div class="bio-section rtl">
    <h2>השכלה</h2>
    <p>ברלד בעל דיפלומה בפדגוגיה של הזמרה מהאקדמיה למוזיקה בוויסבאדן / בית הספר הגבוה למוזיקה ולאמנויות הבמה בפרנקפורט, ותואר שני במוזיקה (MMus) באופרה מבית הספר הגבוה למוזיקה ולאמנויות הבמה בפרנקפורט.</p>
</div>
`;

const switchLanguage = (bioText, lang) => {
    document.getElementById("biotext").innerHTML = bioText;

    // Update active state
    document.querySelectorAll(".language-links a").forEach(link => {
        link.classList.remove("active");
    });
    document.getElementById(lang).classList.add("active");
}

// Language switcher event handlers
document.getElementById("english").addEventListener('click', () => {
    switchLanguage(englishBio, 'english');
});

document.getElementById("german").addEventListener('click', () => {
    switchLanguage(germanBio, 'german');
});

document.getElementById("french").addEventListener('click', () => {
    switchLanguage(frenchBio, 'french');
});

document.getElementById("italian").addEventListener('click', () => {
    switchLanguage(italianBio, 'italian');
});

document.getElementById("hebrew").addEventListener('click', () => {
    switchLanguage(hebrewBio, 'hebrew');
});
