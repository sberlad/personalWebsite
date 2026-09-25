# personalWebsite
SamuelBerlad's professional singer portfolio website

## Structure

Plain static HTML, no build step. Each page is its own `.html` file.

- `css/main.css` – styles shared by every page: colours, header, navigation, mobile menu, footer
- `css/pages/<page>.css` – styles for one page only (loaded after `main.css`)
- `js/main.js` – behaviour shared by every page: mobile menu, header scroll effect, scroll-to-top button, footer year
- `js/pages/<page>.js` – scripts for one page only
- `roles-database.json` – roles shown on the home and repertoire pages
- `blog-posts.json` – blog posts

`404.html` is a standalone page and only uses `css/pages/404.css`.
The header and footer HTML is still repeated in each page, so nav changes need to be made in every `.html` file.
