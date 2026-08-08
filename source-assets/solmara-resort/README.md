# Solmara Resort & Villas 🌙

A modern-luxury rebrand of the Kina-Resort project — rebuilt from scratch with a new stack, new identity, and an AI concierge.

**Original:** vanilla JS + Vite + Firebase (Kina Resort)
**Rebrand:** React 18 + Vite + GSAP/Motion frontend · Node/Express + Azure OpenAI RAG backend

## Features
- 🌙 **Selene, the AI concierge** — RAG chatbot grounded in a knowledge base (`server/kb/*.md`) extracted from the original site's content (rooms, rates, events, policies) plus researched travel context. Uses Azure OpenAI embeddings + chat; falls back to an offline extractive demo mode when no keys are set.
- 🗓️ **Itinerary builder mode** — same chatbot, switched persona: plans time-blocked stays with price estimates.
- 🛏️ Suites & villas, events & packages, gallery/virtual tour with lightbox, reviews + FAQ.
- 📋 Booking flow with **live availability checks, conflict detection (no double-booking), 15-minute payment holds**, and confirmation codes (stored in `server/data/bookings.json`).
- 💳 **Stripe Checkout** payments (PHP) with redirect verification and an optional webhook (`/api/stripe/webhook`); auto-confirms in demo mode without a key.
- 🔎 **My Booking** lookup page (`#/lookup`) and an **admin dashboard** (`#/admin`, optional `ADMIN_KEY` protection) with cancellations.
- 🤖 The concierge answers **live availability questions** ("is the villa free Aug 1 to 4?") straight from the booking system.
- 🌤️ Live-style weather widget for the cove.
- 💱 PHP ⇄ USD currency toggle.
- Dark editorial design: Fraunces + Inter, gold-on-charcoal, GSAP scroll reveals.

## Run it
```bash
npm install            # root (concurrently)
npm run install:all    # client + server deps
npm run dev            # web on :5173, api on :3001
```

## Azure OpenAI (optional)
Copy `server/.env.example` to `server/.env` and fill in your Azure OpenAI endpoint, key, and deployment names. Without keys the chatbot runs in demo mode (keyword retrieval, extractive answers) so everything still works offline.
