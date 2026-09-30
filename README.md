# Kshitij Jain — Portfolio

A responsive portfolio for a backend developer focused on Java, Spring Boot, and MySQL. It includes a filterable logo-based technology stack, developer profiles, live competitive-programming statistics, project and credential templates, live articles, a resume download, and direct contact details.

## Features

- Complete About, Education, and Contact sections on a single scrolling homepage
- Filterable technology matrix with local brand logos
- Developer profile directory with direct links
- Live LeetCode, GitHub, and Codeforces statistics, with achievements generated from the same data
- Resume download that activates automatically once `public/resume.pdf` exists
- Six project templates with media, logo, demo, source, and write-up fields
- Certification and achievement templates
- Live Dev.to, Medium, and Hashnode article aggregation (latest three on the homepage)
- Click-to-copy email, phone, and Discord values
- Static per-route HTML heads, PNG social card, sitemap, and robots policy for link previews and search
- Content-Security-Policy without `unsafe-inline` scripts
- Responsive light/dark themes and accessible navigation
- No analytics, advertising trackers, or third-party font requests

## Technology

- React 19 and React Router 7
- Vite 8 and JavaScript
- Simple Icons 16 for locally bundled brand logos
- Vercel Functions for statistics and article aggregation
- Vitest 5 and ESLint 10
- GitHub Actions for lint, test, and build checks

All package versions are pinned in `package.json` and locked in `package-lock.json`.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

Validated with Node.js 22.14.0 and npm 10.9.2.

## Local Setup

```bash
npm install
npm run dev
```

`npm run dev` and `npm run preview` both run the Vercel functions in `api/` through a small Vite plugin, so `/api/stats` and `/api/articles` return live data locally. Values from `.env` (such as `GITHUB_TOKEN`) are passed to them.

`npm run preview` also applies the headers and redirects from `vercel.json`, so the Content-Security-Policy can be checked locally before deploying.

## Commands

```bash
npm run dev       # development server with local API
npm run build     # production build
npm run preview   # serve dist/ with local API and vercel.json headers
npm run lint      # ESLint
npm test          # Vitest (API parsers, CSP hash, redirect config)
```

## Project Structure

```text
.
├── .github/workflows/ci.yml     # Lint, test, and build on push and pull request
├── api/
│   ├── articles.js              # Dev.to, Medium, and Hashnode aggregator
│   └── stats.js                 # GitHub, LeetCode, and Codeforces aggregator
├── config/vite-plugins.js       # Per-route HTML heads, sitemap/robots, local API
├── public/                      # Favicon, social card, manifest, and resume.pdf (when added)
├── src/
│   ├── components/              # Stack, profiles, stats, templates, blog, and shared UI
│   ├── data/
│   │   ├── portfolio.js         # Editable content, page metadata, and redirects
│   │   └── stats-fallback.json  # Last-known stats shared by the API and the UI
│   ├── hooks/                   # Theme, metadata, copy, active-section, and API hooks
│   ├── pages/                   # Homepage and detailed routes
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── tests/                       # Vitest suites
├── .env.example
├── index.html
├── vercel.json
└── vite.config.js
```

## Routes

| Route | Content |
| --- | --- |
| `/` | Complete scrolling portfolio, ending with Contact |
| `/projects` | Project templates (future case studies) |
| `/competitive-programming` | Detailed GitHub, LeetCode, and Codeforces data |
| `/writing` | All aggregated articles |
| Any unknown route | Custom 404 page |

`/about`, `/skills`, `/education`, `/certifications`, `/achievements`, and `/contact` permanently redirect to their homepage sections. The redirects live in both `vercel.json` (server) and `legacyRedirects` in `portfolio.js` (client); `npm test` checks they match.

## Updating Content

Portfolio content is stored in [`src/data/portfolio.js`](src/data/portfolio.js). It contains:

- Profile and About copy
- Education
- Categorized technology skills and icon keys
- Profile links
- Resume path and download filename
- Site and per-page metadata (`site`, `pages`)
- Six project slots
- Certification and achievement slots
- Blog source links
- Homepage navigation sections

### Resume

1. Save the PDF as `public/resume.pdf`.
2. Rebuild, or restart `npm run dev`.

The hero and Contact buttons switch from "Resume coming soon" to "Download resume" automatically. The file downloads as `Kshitij-Jain-Resume.pdf`; change `resume.downloadName` to rename it.

### Profile Photo

The hero currently uses `ProfilePhotoPlaceholder`. To replace it:

1. Add an optimized WebP or AVIF image under `public/`.
2. Replace the placeholder in `src/pages/Home.jsx`.
3. Preserve the image aspect ratio to avoid layout shift.
4. Add accurate alternative text.

### Social Card

`public/og-image.png` (1200×630) is the image shown in LinkedIn, X, WhatsApp, and Discord previews. `public/og-image.svg` is its editable source. After editing the SVG, re-render it, for example:

```bash
google-chrome --headless=new --hide-scrollbars --window-size=1200,630 \
  --screenshot=public/og-image.png "file://$PWD/public/og-image.svg"
```

### Adding a Page

Add the route in `src/App.jsx` and an entry in `pages` in `portfolio.js`. The build then generates its HTML head and sitemap entry.

### Project, Certification, and Achievement Templates

Replace entries in `projectSlots`, `certificationSlots`, and `achievementSlots` with real, verified information. Include verification or evidence links where possible. Do not publish fabricated metrics or outcomes.

## SEO and Link Previews

Crawlers used for link previews do not run JavaScript. At build time, `config/vite-plugins.js`:

- Fills the title, description, canonical URL, and absolute Open Graph/Twitter URLs in `index.html`
- Writes `projects.html`, `writing.html`, and `competitive-programming.html` with route-specific heads. Vercel serves them at clean URLs through `cleanUrls`.
- Generates `sitemap.xml` and a `robots.txt` that references it

The absolute origin is resolved in this order:

1. `SITE_URL` environment variable
2. `VERCEL_PROJECT_PRODUCTION_URL` (set automatically by Vercel)
3. `http://localhost:4173`

Set `SITE_URL` in Vercel after connecting a custom domain.

## Security Headers

`vercel.json` sets a Content-Security-Policy that only allows same-origin resources and the inline theme script by its SHA-256 hash. JSON-LD is a data block and does not need a hash.

If you edit the inline theme script in `index.html`, `npm test` fails and prints the expected hash. Replace the `sha256-...` value in `vercel.json` with the new one.

## Live Data

### Developer Statistics

`api/stats.js` normalizes GitHub, LeetCode, and Codeforces data. It applies provider timeouts, CDN caching, and last-known fallbacks from `src/data/stats-fallback.json`. The UI uses the same file, so update the values in one place.

An optional server-side `GITHUB_TOKEN` raises GitHub API rate limits:

```text
GITHUB_TOKEN=your_server_side_token
```

Never prefix the token with `VITE_` or commit it.

### Articles

`api/articles.js` aggregates every article returned by:

- Dev.to's user articles API
- Medium's author RSS feed
- Hashnode's public publication API

Only absolute `https:` article and image URLs are kept. Entries without a valid title, URL, or date are dropped. Provider failures are isolated, so available sources continue to render. Hashnode may show as temporarily unavailable when its public API blocks automated requests.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Use `npm run build` and the `dist` output directory.
4. Optionally configure `GITHUB_TOKEN` and `SITE_URL`.
5. Deploy a preview and verify:

```bash
curl -i https://YOUR-PREVIEW-URL.vercel.app/api/stats
curl -i https://YOUR-PREVIEW-URL.vercel.app/api/articles
curl -i https://YOUR-PREVIEW-URL.vercel.app/projects
curl -i https://YOUR-PREVIEW-URL.vercel.app/about        # 308 to /#about
curl -s https://YOUR-PREVIEW-URL.vercel.app/sitemap.xml
```

Check a link preview with a tool such as the LinkedIn Post Inspector after the production deploy. Vercel's SPA requirements are documented in its [Vite deployment guide](https://vercel.com/docs/frameworks/vite).

## Continuous Integration

`.github/workflows/ci.yml` runs `npm ci`, lint, tests, and build on every push to `main` and on pull requests.

## Pending Content

- Homepage profile photo
- Resume file (`public/resume.pdf`)
- Six real project entries and media
- Certifications with verification links
- Additional achievements with evidence links
- Final custom domain (`SITE_URL`)

## License

This project is available under the [MIT License](LICENSE).
