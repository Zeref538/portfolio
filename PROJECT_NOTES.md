# Project Notes — what this is and what was done

**Built:** July 3, 2026, by Claude Code from John's CV + LinkedIn content.

## What this project is
A personal AI/ML engineer portfolio website for John Andrei Martinez.
- **Stack:** React 18 + Vite (no UI libraries). Production bundle ≈ 51 KB gzipped.
- **Design:** dark minimal (near-black background, green `#22C55E` accent), Archivo headings / Space Grotesk body.
- **Interactive effects:** custom cursor (dot + trailing ring that grows over links/cards) and a faint particle grid that lights up green near the mouse. Both are canvas/rAF-based, pause when the tab is hidden, and turn off on touch devices or when reduced motion is enabled — so they cost nothing in latency.

## How to run
```bash
npm install   # already done once
npm run dev   # opens at http://localhost:5173
npm run build # production build into dist/
```

## Where everything lives
| File | What it does |
|------|--------------|
| `src/data.js` | **ALL site content.** Edit this to add/remove/change projects, skills, certifications, experience, education, contact links. No other file needs touching. |
| `src/App.jsx` | Page layout — renders sections from data.js |
| `src/index.css` | All styling (colors are CSS variables at the top) |
| `src/components/Cursor.jsx` | Custom cursor effect |
| `src/components/ParticleField.jsx` | Background particle grid |
| `src/components/Reveal.jsx` | Fade-in-on-scroll wrapper |

## Content decisions made
- FlyRank AI internship shown as **ML Engineering Intern, Jun 2026 – Present** with **placeholder bullets marked `TODO` in `src/data.js`** — replace with real work.
- Projects: ACRA (0.740 mAP50 highlighted), CafèSync, CLICKSILOG — from LinkedIn.
- Contact shows email, GitHub (Zeref538), LinkedIn. **Phone and street address intentionally omitted** for privacy; location shown as "Bulacan, Philippines". Add phone back in `src/data.js` → `profile` if wanted.
- All 8 certifications, grouped skills, Dean's Lister + competition placements included.

## To do next
1. Replace the 3 TODO FlyRank bullets in `src/data.js`.
2. Add project links (each project has an empty `link: ""` field — fill it and a "View Project" button appears).
3. Deploy: `npm run build`, then drag `dist/` to Netlify, or push to GitHub and import in Vercel.
