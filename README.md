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

- `src/siteData.js` — stats, roles, projects, media credits, achievements, education. Each section is a plain array near the top of the file.
- `src/TravelGlobe.jsx` — the `countriesVisited` array near the top. Format: `{ country, city, lat, lng, note }` (`note` is optional).
- `src/globals.css` — colors, both light and dark mode.
- `src/App.jsx` — layout only; imports its content from `siteData.js` instead of defining it inline.

Add a role/project/media credit/country and it automatically gets its own photo box in `npm run photos` below — nothing else to touch.

## Adding photos

```
npm run photos
```

Opens a local tool at `localhost:5050` — never touches the live site directly. It shows every photo slot on the site (hero shot, company logos, project screenshots, acting/modeling credits, travel-globe country photos) as a box:

- Drag a photo onto a box, or click it to browse. HEIC (iPhone photos), PNG, JPEG, whatever — it's converted to a web-ready JPEG and auto-resized if it's oversized.
- The ⇄ button on a filled box moves that photo to a different slot (swaps if the target already has one).
- The ✕ button removes a photo (click twice to confirm).

It writes straight into `public/images/...` under the exact filename the site expects — no manual renaming. Once you're happy with what's there:

```
git add . && git commit -m "Add photos" && git push
```

A slot with no photo just doesn't render anything on the site — nothing looks broken either way.

## Deploy to Render

1. Push this folder to a GitHub repo.
2. On Render: **New** → **Static Site** → connect the repo.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Create Static Site. It'll be live at `https://<name>.onrender.com` in a couple minutes, and redeploys automatically on every push.

`render.yaml` is included, so if you use Render's **Blueprint** option instead (New → Blueprint) it'll read those settings automatically rather than you typing them into the form.

### Connecting sailkcaj.com

In the site's Render dashboard: **Settings** → **Custom Domains** → add `sailkcaj.com` (and `www.sailkcaj.com` if you want both). Render gives you a DNS record to add — either a CNAME (if using a subdomain/www) or an A record + ALIAS/ANAME (for the bare root domain). Add that record with whoever you bought the domain through, then wait for it to propagate (usually minutes, sometimes a few hours) and Render auto-issues the SSL certificate once it verifies.

## Time tab storage

Time is private to Jack's existing Firebase account (`liasjack1@gmail.com`).
The Time tab opens a sign-in prompt for visitors. Its contents appear only
after the owner signs in with the existing Firebase email/password login,
which stays signed in across visits. Signing out immediately removes the
private contents and returns to the sign-in prompt.

`src/ownerIdentity.js` and `firestore.rules` both restrict access to the owner's
Firebase UID. Firestore rules protect reads **and** writes, including direct
requests outside the website. Creating another Firebase account does not grant
access. If the owner account is ever replaced, update the UID in both files.

The hour log and notes stay in Firestore and sync across the owner's devices.
Private data uses memory caching. Data already downloaded by previous
visitors cannot be recalled.

### Deploying privacy changes

Render automatically deploys the frontend when changes are pushed to `main`.
Database rules must also be deployed to the real Firebase project:

```
firebase deploy --only firestore:rules --project sailkcaj-c29a8
```

Alternatively, publish `firestore.rules` in the Firebase console's Firestore
Rules tab. `.firebaserc` intentionally defaults to the demo project for local
emulators; always specify the production project for a real rules deployment.

### Recovering data from before this was shared

If a browser has old entries logged before this Firebase setup existed, open sailkcaj.com there, sign in as the editor, and a banner will offer to import that browser's saved data into the shared database — it only fills in dates that aren't already logged centrally, so it can't overwrite anything.

### Testing locally against a fake project (optional)

`npm run emulators` starts a local Firestore + Auth emulator (needs Java; no real Firebase project or login required — `.firebaserc` points it at a fake "demo-" project). With that running, `VITE_USE_FIREBASE_EMULATOR=true npm run dev` points the site at the emulator instead of production, so you can test changes without touching real data. The emulator UI is at `http://127.0.0.1:4000`.

## Notes

- The globe pulls in Three.js, so the JS bundle is ~600KB gzipped — heavier than the rest of the site combined, but normal for this kind of library and not a problem for Render's static hosting.
- The site itself is still fully static (no server, no environment variables) — Render's free static site tier covers it completely. The Time tab's private data is the one exception, backed by Firestore directly from the browser (see above) rather than by anything Render runs.
