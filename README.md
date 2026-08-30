# Jack's site

React + Vite. The globe uses `react-globe.gl` (Three.js under the hood).

## Test it locally

```
npm install
npm run dev
```

Opens at http://localhost:5173 with hot reload — edit a file, see it update.

To test the actual production build (closer to what Render will serve):

```
npm run build
npm run preview
```

Opens at http://localhost:4173.

## Editing content

- `src/App.jsx` — everything except the globe: stats, roles, projects, media credits. Each section is a plain array near the top of the file.
- `src/TravelGlobe.jsx` — the `countriesVisited` array near the top. Format: `{ country, city, lat, lng, note }` (`note` is optional).
- `src/globals.css` — colors, both light and dark mode.

## Deploy to Render

1. Push this folder to a GitHub repo.
2. On Render: **New** → **Static Site** → connect the repo.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Create Static Site. It'll be live at `https://<name>.onrender.com` in a couple minutes, and redeploys automatically on every push.

`render.yaml` is included, so if you use Render's **Blueprint** option instead (New → Blueprint) it'll read those settings automatically rather than you typing them into the form.

### Connecting sailkcaj.com

In the site's Render dashboard: **Settings** → **Custom Domains** → add `sailkcaj.com` (and `www.sailkcaj.com` if you want both). Render gives you a DNS record to add — either a CNAME (if using a subdomain/www) or an A record + ALIAS/ANAME (for the bare root domain). Add that record with whoever you bought the domain through, then wait for it to propagate (usually minutes, sometimes a few hours) and Render auto-issues the SSL certificate once it verifies.

## Notes

- The globe pulls in Three.js, so the JS bundle is ~600KB gzipped — heavier than the rest of the site combined, but normal for this kind of library and not a problem for Render's static hosting.
- No server, no database, no environment variables — this is a fully static site, so Render's free static site tier covers it completely.
