# John Andrei Martinez — Portfolio

**Live site: [johnandrei.vercel.app](https://johnandrei.vercel.app)**

AI/ML engineer portfolio with an "ML terminal" personality — boot log, CRT scanlines, tmux-style status bar — and **zeref-bot**, a grounded Azure OpenAI (gpt-5-mini) chatbot that answers recruiter questions about me from live site data, served through a rate-limited Vercel serverless function.

React 18 + Vite, no UI libraries, ~50 KB gzipped JS.

## Featured projects

| Project | What it is | Headline result |
|---|---|---|
| [Aegix AI](https://github.com/Zeref538/aegix-ai) | RAG system screening PH employment contracts against the Labor Code — LangChain LCEL + MongoDB Atlas vector search, live SSE streaming ([demo](https://aegix-ai-zeref.vercel.app)) | 84.5% verdict accuracy, 100% recall on 18 labeled contracts |
| [ACRA](https://github.com/Zeref538/ACRA) | Thesis: CNN-powered color-accessibility re-encoding for public signage — YOLOv8m + CLAHE → CIELAB → Fuzzy C-Means → CIEDE2000 ([demo](https://acra-sandy.vercel.app/dashboard)) | 0.740 mAP50 on 33,774 custom-annotated boxes |
| FlyRank ML Internship | Refresh-priority ranking on real search data — honest client-holdout validation, ranked review queues ([repo](https://github.com/Zeref538/flyrank-ml-internship)) | In progress, Jun 2026 — |
| [CafèSync](https://github.com/Zeref538/CafeSync) | Smart coffee-shop operations: Firestore realtime multi-screen sync, PayMongo, Python AI insights ([demo](https://cafesync-3b25a.web.app/station/management)) | Zero-refresh live sync |
| [ClickSilog](https://github.com/Zeref538/ClickSilog) | Self-ordering + real-time Kitchen Display System with automated inventory deduction | End-to-end order sync |
| [Smart Scheduling](https://github.com/Zeref538/smart-scheduling-system) | Java constraint engine generating conflict-free weekly timetables | Conflict-free in seconds |

Full details, screenshots, and demos on the [live site](https://johnandrei.vercel.app).

## Stack & features

- **Frontend:** React 18 + Vite, GSAP, custom canvas effects (cursor, particle grid) — rAF-driven, paused on hidden tabs, disabled on touch / reduced-motion
- **zeref-bot:** Azure OpenAI behind a Vercel serverless function (`api/chat.js`) with per-IP rate limiting, grounded in site data
- **Perf:** vendor chunk splitting, rAF-throttled scroll effects, fonts as the only third-party request

## Run locally

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # production build into dist/
```

## Edit content — no code knowledge needed

**Everything on the site lives in [`src/data.js`](src/data.js)** — profile, experience, projects, skills, certifications, education.

- **Add a project:** copy one `{ ... }` block in the `projects` array, edit, save.
- **Add a certification:** add a `{ name, issuer, year, url, image }` line to `certifications` (badge PNGs go in `public/certs/`).
- Same pattern for `skills`, `education`, `profile`.

The dev server hot-reloads instantly.

## Deploy

```bash
npm run build
```

Push to GitHub and import in Vercel (auto-detects Vite; the chatbot needs the Azure OpenAI env vars from `.env.local` set in Vercel), or drop `dist/` on Netlify for a static-only build.
