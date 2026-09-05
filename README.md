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

The Time tab's data (hour log + notes) lives in Firestore, not this browser — anyone who visits sailkcaj.com sees the same data, from any device or browser, live. Reading is public; only a signed-in editor can change it (a "🔒 View only · Sign in to edit" control sits at the top of the tab). The site itself is still fully static — Firestore/Auth are called directly from the browser, so nothing changes about how Render hosts or builds this.

### One-time setup (do this once, in the Firebase console)

1. Go to [console.firebase.google.com](https://console.firebase.google.com/) and create a project (any name — e.g. "sailkcaj"). No credit card needed.
2. **Build → Firestore Database → Create database** — any region, start in production mode.
3. Firestore → **Rules** tab — paste in the contents of `firestore.rules` from this repo, then **Publish**.
4. **Build → Authentication → Get started → Sign-in method → Email/Password** → enable it.
5. Authentication → **Users → Add user** — pick any email + a real password (this becomes the one editor login; it doesn't need to be a real inbox, it's just a credential). Keep the password somewhere safe — it's never stored in this repo.
6. Project settings (gear icon) → scroll to **Your apps** → **Add app → Web** (the `</>` icon) → register it (no need for Firebase Hosting) → copy the `firebaseConfig` object it shows you.
7. Paste those values into `src/firebase.js` in place of the `REPLACE_WITH_YOUR_...` placeholders. These values are not secret — they identify the project, they don't grant access (the rule from step 3 does that) — so it's fine that they're visible in the site's JS.
8. `git add . && git commit -m "Connect Time tab to Firebase" && git push` — Render redeploys automatically.

Sign in with the email/password from step 5 on the live site to unlock editing on that device; it stays signed in there until you sign out.

### Recovering data from before this was shared

If a browser has old entries logged before this Firebase setup existed, open sailkcaj.com there, sign in as the editor, and a banner will offer to import that browser's saved data into the shared database — it only fills in dates that aren't already logged centrally, so it can't overwrite anything.

### Testing locally against a fake project (optional)

`npm run emulators` starts a local Firestore + Auth emulator (needs Java; no real Firebase project or login required — `.firebaserc` points it at a fake "demo-" project). With that running, `VITE_USE_FIREBASE_EMULATOR=true npm run dev` points the site at the emulator instead of production, so you can test changes without touching real data. The emulator UI is at `http://127.0.0.1:4000`.

## Notes

- The globe pulls in Three.js, so the JS bundle is ~600KB gzipped — heavier than the rest of the site combined, but normal for this kind of library and not a problem for Render's static hosting.
- The site itself is still fully static (no server, no environment variables) — Render's free static site tier covers it completely. The Time tab's shared data is the one exception, backed by Firestore directly from the browser (see above) rather than by anything Render runs.
