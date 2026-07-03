# John Andrei Martinez — Portfolio

Minimal, dark, interactive AI/ML engineer portfolio. React + Vite, zero UI libraries, ~50 KB gzipped JS.

## Run locally

```bash
npm install
npm run dev
```

## Edit content — no code knowledge needed

**Everything on the site lives in [`src/data.js`](src/data.js).**

- **Add a project**: copy one `{ ... }` block in the `projects` array, edit the text, save.
- **Delete a certification**: remove its `{ ... }` line from `certifications`.
- **Update FlyRank bullets**: edit the first entry in `experience` (placeholders are marked with TODO).
- Same pattern for `skills`, `education`, `profile` (name, tagline, about, links).

The dev server hot-reloads changes instantly.

## Deploy (free)

```bash
npm run build
```

Then drop the `dist/` folder on Netlify, or push to GitHub and import into Vercel — both auto-detect Vite.

## Performance / interaction notes

- Custom cursor and particle grid are GPU/canvas-based, `requestAnimationFrame`-driven, and pause when the tab is hidden.
- Both disable themselves on touch devices and when `prefers-reduced-motion` is set.
- No external JS dependencies beyond React; fonts are the only third-party request.
