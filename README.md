<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-d4943a?style=for-the-badge" alt="Status: In Development" />
  <img src="https://img.shields.io/badge/stage-1%20of%204-3d7a4e?style=for-the-badge" alt="Stage 1 of 4" />
</p>

# destract

A cozy focus platform for distracted minds. Timer, ambient sounds, notes, todos, and a companion bear — all on one screen, wrapped in a warm palette that feels like your favorite room.

> Built for people who need a little help staying focused — not another cold productivity tool, but a cozy space that makes deep work feel good.

## What it does

- **Pomodoro timer** with mood-aware durations (Focused, Calm, Anxious, Restless)
- **Ambient sound mixer** — layer Rain, Waves, Cafe, Fire, Forest, and Delta tracks with individual volume
- **Quick notes + todo list** — capture thoughts without leaving the flow
- **Curated spaces** — 8 themed environments (Rainy Library, Ocean Cabin, Zen Garden...) each with its own wallpaper, color palette, and default soundscape
- **Companion bear** — a little buddy that reacts to your focus state
- **Session stats** — track streaks, focus time, and projects over time

## The vibe

Warm dark olive with amber accents. Not the cold blues and grays of every other productivity app. The "cozy room" feeling — intentional, inviting, and distraction-proof.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | Chakra UI v3 + custom design tokens |
| State | Zustand + IndexedDB persistence |
| Audio | Howler.js (multi-track layered mixing) |
| Auth | NextAuth.js v5 (Google OAuth) |
| Database | Supabase (Postgres + RLS) |
| Animation | Framer Motion |
| Deployment | Vercel |

## Getting started

```bash
# Install dependencies
npm install

# Copy environment template and fill in your keys
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment variables

See `.env.local.example` for required keys:
- **Supabase** — project URL, anon key, service role key
- **NextAuth** — URL, secret
- **Google OAuth** — client ID, client secret

## Project structure

```
app/           → Next.js App Router pages and API routes
components/    → UI components by feature (timer, notes, todos, sounds, companion, spaces...)
theme/         → Chakra UI v3 custom theme, tokens, recipes, space palettes
store/         → Zustand store with feature slices
hooks/         → Custom React hooks (useTimer, useAudio, useIdle...)
lib/           → Supabase client, auth config, sound utilities
types/         → Shared TypeScript interfaces
public/        → Wallpapers, sound files, companion assets
```

## Implementation roadmap

| Stage | Focus | Status |
|-------|-------|--------|
| 1. Foundation | Theme, types, schema, scaffold | Done |
| 2. Core Experience | Layout, timer, notes, todos, store | Next |
| 3. Enrichment | Auth, sounds, companion bear | Planned |
| 4. Polish | Sessions, stats, animations, mobile, a11y | Planned |

Full spec: [`docs/superpowers/specs/2026-03-29-destract-v1-design.md`](docs/superpowers/specs/2026-03-29-destract-v1-design.md)

## License

MIT
