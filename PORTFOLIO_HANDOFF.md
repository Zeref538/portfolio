# Portfolio — Session Handoff

> Paste this at the start of a new chat to continue the portfolio work with full
> context. Kept OUTSIDE the repo (parent Portfolio folder) so it's never
> committed to the public site.

## Who / where

- Owner: John Andrei Martinez, GitHub `Zeref538`, AI/ML student (OLFU).
- Live site: https://johnandrei.vercel.app · Repo: github.com/Zeref538/portfolio
- Portfolio repo path: `C:\Users\johna\OneDrive\Documents\Portfolio\Portfolio`
- Each project has its own repo folder under `C:\Users\johna\OneDrive\Documents\Portfolio\`.

## The portfolio site (how it's built)

- React + Vite, deployed on Vercel (auto-deploys on push to `master`).
- "ML terminal" theme: boot log, CRT scanlines, tmux-style status bar.
- **All site content is edited in `src/data.js`** — projects, skills, certs,
  experience, education arrays. The UI renders itself from these.
- Palette: bg `#07090d`, text `#e6edf3`, muted `#8b98a9`, accent violet
  `#8b5cf6`, accent-2 cyan `#22d3ee`. Fonts: Sora / Inter / JetBrains Mono.
- Skill/issuer icons: `src/skillIcons.jsx` (add a mapping when adding a skill).
- Raw source images + project READMEs live in `source-assets/<Project>/` (was
  `img/`); certs in `source-assets/certs/`. `public/` holds the served copies.
- zeref-bot = RAG chatbot over `api/_index.json`. **Rebuild it whenever a project
  is added or its card changes**: `node --env-file=.env.local scripts/build-index.mjs`
  then commit `api/_index.json`. It ingests `src/data.js` + `knowledge/*.md` +
  `source-assets/*/README.md` (README.md only — other .md files are ignored).

## Standing workflow (do this every change — from memory)

1. Edit `src/data.js` (or components) in the portfolio repo.
2. Convert any images: screenshots → `public/projects/*.jpg` at ~1000px q82
   (use ImageMagick `magick`); videos → gif via the pip `imageio-ffmpeg` binary
   (no system ffmpeg installed). Certs → `public/certs/*` at ~600px.
3. `npm run build` to verify. New/changed project? Also rebuild the RAG index
   (`node --env-file=.env.local scripts/build-index.mjs`) and commit `api/_index.json`.
4. Commit + push. **Auto commit+push after each change batch** (owner rule).
   **Never add a `Co-Authored-By: Claude` trailer** (owner rule).
5. Remote sometimes has force-pushes — if push rejects, `git pull --rebase`
   then push.

## Current site state (as of this handoff)

**Projects (12), shown strongest-first with a "show 8 / show more" collapse:**
callback-ai (agent), Alfred (agent), Refusal Calibration LLM Fine-Tuning,
Token-Optimization LLM Fine-Tuning, YODA (agent), Aegix (RAG), Hangin'
(forecasting), ACRA (CV, thesis) — then collapsed: Solmara (RAG), Portfolio,
CafèSync, CLICKSILOG, Smart Scheduling.
- Project **category filter chips**: Agentic AI · RAG · Fine-Tuning · ML &
  Forecasting · Full-Stack. Each project has a `groups: [...]` array (multi-
  category). Collapse only applies in the "All" view.
- ACRA has **no source button** (`link: ""`) — private thesis repo; demo only.
- `demoLabel` field overrides the "live demo" link text (e.g. "case study").

**Certs (10):** Claude 101 (Anthropic, verify via skilljar) is first, then
Google AI Pro, Google Advanced Data Analytics (+Capstone), AWS AI Practitioner
Challenge, OCI AI Foundations, CCST Cybersecurity, MongoDB RAG, etc. Filter by
issuer. Owner has been advised weak free certs dilute strong ones — a "show
top 5 / collapse" for certs was suggested but NOT yet built.

## Project pipeline (planned, most have handoff docs)

Shipped/live on site: callback-ai, Alfred, YODA, Refusal Calibration,
Token-Optimization, plus the older ones.

Planned (docs are handoff-ready in each folder):
- **Kalis** — chess coach agent (Stockfish ground truth). `Kalis/PLAN.md`.
- **Pulso** — self-improving dengue nowcaster (daily refresh + incremental
  learning + drift). `Pulso/` PRD+PLAN+HANDOFF. (Was pitched as "Bignay".)
- **Munti** — tiny LLM from scratch on TinyStories (free Kaggle). `Munti/`
  PRD+PLAN+HANDOFF.
- **LiitLLM** — tiny Tagalog LLM from scratch, reuses Munti's code. `LiitLLM/
  HANDOFF.md` only (owner plans it himself; depends on Munti).
- **Carson** — local desktop butler agent (capstone). `Carson/PLAN.md`.
- **YODA-mini** — fine-tuned planner for YODA. In yoda repo `docs/`.
- Backlog: Ipon (private investment agent).

Rejected ideas (don't re-pitch): Bantay, Ayos, Ulat, Tally, Sundo, Kasama,
Tindera, Repaso, agent-eval harness, and the various naming alternates.

## Persistent memory

Auto-memory lives at the project memory dir; `MEMORY.md` indexes it. Key files:
`project-pipeline.md`, `commit-after-every-change.md`, `no-claude-coauthor.md`,
`linis-project.md` (YODA), `yoda-mini-plan.md`. Read these on session start.

## Kickoff prompt for the new chat

> Continuing my portfolio work. Read PORTFOLIO_HANDOFF.md in
> C:\Users\johna\OneDrive\Documents\Portfolio\ for full context — the site is at
> Portfolio/Portfolio (React+Vite, edit src/data.js, build + commit + push,
> Vercel auto-deploys, no Claude co-author trailer). Here's what I want to do
> next: [FILL IN].
