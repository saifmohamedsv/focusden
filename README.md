<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Chakra_UI-v3-319795?style=for-the-badge&logo=chakraui" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Zustand-5-764ABC?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Status-Under%20Development-FFA500?style=for-the-badge" />
</p>

<h1 align="center">FocusDen</h1>
<h3 align="center">Focus, Flow, Feel Good.</h3>

<p align="center">
  <strong>A cozy, dark-themed focus platform that combines a Pomodoro timer, ambient soundscapes, an animated companion bear, curated workspace environments, todos, notes, mood tracking, and session analytics — all on a single screen.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#spaces--environments">Spaces</a> &bull;
  <a href="#companion-bear">Companion</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#roadmap">Roadmap</a>
</p>

> **Note:** This project is under active development. Features listed below reflect the current state of the codebase.

---

## Why FocusDen?

Most productivity apps feel clinical. FocusDen is different — it's a **cozy digital workspace** where a little bear works alongside you, ambient rain and fireplace sounds fill the background, and beautiful hand-crafted environments set the mood. It's not just a timer; it's a space you *want* to come back to.

---

## Features

### Pomodoro Timer
- **Configurable focus/break durations** with a beautiful SVG ring progress animation (amber during focus, sage green during break)
- **4-round sessions** with visual dot indicators tracking your progress
- **Click-to-edit durations** — click the timer display when idle to adjust focus (5–60 min) and break (1–30 min) with keyboard support
- **Play/pause/reset/skip controls** with smooth hover animations
- **Transition cards** — animated inline cards between phases with auto-continue (10s countdown), "Take a break" / "Keep going" / "End session" options
- **Session summary** — full-screen celebration modal after 3+ rounds showing total minutes focused, rounds completed, and todos done
- **Quick Start** — "I need 5 minutes" button for instant micro-focus sessions

### Mood-Aware Presets

Pick your mood, and FocusDen auto-tunes the experience:

| Mood | Focus Duration | Break Duration | Suggested Sounds |
|------|---------------|----------------|-----------------|
| **Focused** | 25 min | 5 min | Cafe, Forest |
| **Calm** | 30 min | 7 min | Rain, Waves |
| **Anxious** | 15 min | 5 min | Rain, Delta Waves |
| **Restless** | 20 min | 5 min | Cafe, Fire |

### Companion Bear

A hand-crafted SVG bear that reacts to your work in real time:

| State | Trigger | Visual |
|-------|---------|--------|
| **Working** | Timer is running | Bear at desk with laptop, eyes focused on screen, code lines visible |
| **Celebrating** | Focus round complete (3s) | Arms raised, happy eyes (^^), rosy cheeks, sparkles floating around |
| **Stretching** | Break timer active | Arms stretched wide, peaceful closed eyes, stretch lines near paws |
| **Idle** | 5 min of no interaction | Drowsy/yawning, half-closed eyes, Zzz floating, slumped body |

The bear speaks to you through speech bubbles: *"working hard"*, *"nice job!"*, *"stretch break"*, *"still there?"*

State transitions are animated with Framer Motion `AnimatePresence` and respect `prefers-reduced-motion`.

### Ambient Sound Mixer

Six looping ambient tracks powered by Howler.js — layer them together to create your perfect soundscape:

| Track | Sound |
|-------|-------|
| **Rain** | Steady rain ambience |
| **Waves** | Ocean waves |
| **Cafe** | Coffee shop chatter |
| **Fire** | Crackling fireplace |
| **Forest** | Forest birds and wind |
| **Delta** | Delta/theta binaural beats |

Each track has an independent volume slider (0–100%). Mix multiple tracks simultaneously. Volume settings persist across sessions via IndexedDB.

### Curated Spaces

Eight hand-designed workspace environments, each with a unique SVG wallpaper, color palette, and default sound configuration:

| Space | Vibe | Accent | Default Sounds |
|-------|------|--------|---------------|
| **Rainy Library** | Cozy | Warm Amber | Rain 60%, Fire 30% |
| **Ocean Cabin** | Nature | Ocean Blue | Waves 70%, Forest 20% |
| **Mountain Lodge** | Cozy | Warm Brown | Fire 60%, Rain 20% |
| **Zen Garden** | Nature | Sage Green | Forest 50%, Delta 30% |
| **Sunset Desert** | Ambient | Sunset Orange | Fire 50% |
| **Midnight City** | Urban | Purple | Cafe 50%, Rain 30% |
| **Autumn Cafe** | Cozy | Autumn Amber | Cafe 60%, Rain 40% |
| **Northern Cabin** | Cozy | Cool Blue | Fire 50%, Waves 30% |

Switching spaces crossfades the wallpaper with Framer Motion and smoothly transitions the color palette over 600ms via CSS custom properties.

### Productivity Tools

- **Todo List** — Add, check off, delete, and drag-to-reorder tasks (via dnd-kit). Expandable to a floating overlay panel. Badge shows pending count.
- **Quick Notes** — Free-form textarea with 500ms debounced auto-save. Expandable overlay with line count badge.
- **Project Naming** — Tag your sessions with a project name for tracking and analytics.

### Stats Dashboard

A dedicated `/stats` page with:

- **Total Focus Hours** — All-time accumulated focus minutes
- **Current Streak** — Consecutive days with at least one session
- **Session Count** — Total completed sessions
- **Weekly Focus Chart** — Custom SVG bar chart showing focus minutes per day (last 7 days)
- **Streak Calendar** — Heatmap with intensity levels (0 min = dim, ≤15 = 30%, ≤30 = 60%, >30 = full accent)
- **Top Projects** — Ranked list of most-focused projects this week
- **Favorite Space** — Most-used workspace environment

### Authentication & Persistence

- **Google OAuth** via NextAuth.js v5 — one-click sign in
- **Offline-first state** — Zustand store persisted to IndexedDB via idb-keyval, survives page refresh
- **Server-side sessions** — Completed focus sessions saved to Supabase PostgreSQL with Row Level Security
- **Dev mode bypass** — Auth skipped in development when Google credentials aren't configured

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.1 |
| **UI Library** | React | 19.2.4 |
| **Language** | TypeScript | 5.x |
| **Component Library** | Chakra UI | 3.34 |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.38 |
| **State Management** | Zustand (slice pattern) | 5.0 |
| **Persistence** | idb-keyval (IndexedDB) | 6.2 |
| **Audio Engine** | Howler.js | 2.2 |
| **Drag & Drop** | dnd-kit (core + sortable) | 6.3 / 10.0 |
| **Authentication** | NextAuth.js (Google OAuth) | 5.0 beta |
| **Database** | Supabase (PostgreSQL + RLS) | 2.100 |
| **Validation** | Zod | 4.3 |
| **Fonts** | DM Sans, Lora, JetBrains Mono | — |

---

## Architecture

### State Management (Zustand Slices)

```
useAppStore
├── timerSlice       → status, timeRemaining, work/break durations, round tracking
├── sessionSlice     → mood, projectName, sessionStartedAt
├── soundSlice       → 6 audio tracks with volume/enabled state
├── spaceSlice       → activeSpaceId
├── todosSlice       → todos array (id, text, completed, order)
├── notesSlice       → notesContent string
└── companionSlice   → bear state (working/celebrating/idle/stretching)
```

Persisted to IndexedDB: durations, mood, project name, sounds, space, todos, notes. Ephemeral (not persisted): timer status, time remaining, companion state.

### Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   sessions   │     │    spaces    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (uuid)    │◄────│ user_id (FK) │     │ id (uuid)    │
│ google_id    │     │ id (uuid)    │     │ name         │
│ email        │     │ space_id (FK)│────►│ category     │
│ display_name │     │ project_name │     │ wallpaper    │
│ image        │     │ mood         │     │ palette_json │
│ created_at   │     │ duration_min │     │ default_     │
└──────────────┘     │ todos_done   │     │   sounds     │
                     │ started_at   │     │ companion_   │
                     │ ended_at     │     │   theme      │
                     └──────────────┘     └──────────────┘

RLS: Enabled on all tables
Users: read/update own row
Sessions: read/insert own sessions
Spaces: all authenticated users can read
```

### API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js handlers (Google OAuth) |
| POST | `/api/sessions` | Save a completed session (Zod-validated) |
| GET | `/api/sessions/stats` | Aggregated stats: focus hours, streak, weekly breakdown, top projects |

---

## App Layout

```
┌────────────────────────────────────────────────────────┐
│  NavBar  [Logo]  [Stats]  [Settings]  [Avatar]         │
├──────────┬─────────────────────────┬───────────────────┤
│          │                         │                   │
│  Sound   │     Timer Display       │   Space Grid      │
│  Mixer   │     (Pomodoro Ring)     │   (8 cards)       │
│          │                         │                   │
│  6 track │     Bear Companion      │                   │
│  sliders │     (SVG + bubble)      │                   │
│          │                         │                   │
│          │  ┌─────────┬─────────┐  │                   │
│          │  │  Todos  │  Notes  │  │                   │
│          │  │  Dock   │  Dock   │  │                   │
│          │  └─────────┴─────────┘  │                   │
├──────────┴─────────────────────────┴───────────────────┤
│  Mood Picker  [Focused] [Calm] [Anxious] [Restless]    │
│  Quick Start  [I need 5 minutes]                       │
│  Project Name [Optional input]                         │
└────────────────────────────────────────────────────────┘
```

Responsive: 3-column desktop → stacked layout on mobile with bottom drawer and smaller timer ring (220px).

---

## Project Structure

```
focusden/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   ├── providers.tsx                 # Chakra + NextAuth providers
│   ├── globals.css                   # Theme variables, dark palette
│   ├── login/page.tsx                # Google OAuth login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Auth guard, workspace layout
│   │   ├── page.tsx                  # Main focus workspace
│   │   ├── stats/page.tsx            # Analytics dashboard
│   │   └── hydration-guard.tsx       # Zustand hydration wrapper
│   └── api/
│       ├── auth/[...nextauth]/       # NextAuth handlers
│       └── sessions/                 # Session CRUD + stats
├── components/
│   ├── companion/                    # Bear SVGs (4 states) + speech bubble
│   ├── timer/                        # Ring, controls, display, transitions
│   ├── sounds/                       # Mixer panel + volume sliders
│   ├── spaces/                       # Grid, cards, wallpaper backgrounds
│   ├── todos/                        # Todo list + dock + drag-and-drop
│   ├── notes/                        # Notes panel + dock
│   ├── mood/                         # Mood picker pills
│   ├── session/                      # Project input, quick start, summary
│   ├── stats/                        # Charts, calendar, top projects
│   ├── layout/                       # NavBar, RightPanel, WorkspaceLayout
│   └── ui/                           # FloatingPanel overlay
├── store/
│   ├── index.ts                      # Combined Zustand store
│   └── slices/                       # 7 state slices
├── hooks/
│   ├── useTimer.ts                   # Global timer interval
│   ├── useAudio.ts                   # Howler.js audio manager
│   ├── useIdle.ts                    # User inactivity detection (5 min)
│   └── useHydration.ts              # Zustand IndexedDB hydration
├── lib/
│   ├── auth/                         # NextAuth config + user context
│   └── supabase/                     # Client, server, queries, migrations
├── theme/
│   ├── palettes.ts                   # 8 space color palettes
│   ├── tokens/                       # Colors + typography tokens
│   └── recipes/                      # Button, card, input, slider recipes
├── public/
│   ├── sounds/                       # 6 ambient MP3 tracks
│   └── wallpapers/                   # 8 SVG environment wallpapers
├── docs/superpowers/                 # Design specs + implementation plans
└── types/index.ts                    # All TypeScript definitions
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A Supabase project ([create one free](https://supabase.com))
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com))

### Installation

```bash
git clone https://github.com/saifmohamedsv/focusden.git
cd focusden
npm install
```

### Environment Variables

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (for API routes) |
| `NEXTAUTH_URL` | Yes | App URL (e.g., `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth.js |
| `GOOGLE_CLIENT_ID` | No* | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No* | Google OAuth client secret |

*Auth is bypassed in development when Google credentials aren't set.

### Database Setup

Run the migrations in your Supabase SQL editor in order:

```sql
-- 1. Users table
lib/supabase/migrations/001_create_users.sql

-- 2. Spaces table
lib/supabase/migrations/002_create_spaces.sql

-- 3. Sessions table
lib/supabase/migrations/003_create_sessions.sql

-- 4. Seed the 8 default spaces
lib/supabase/seed.sql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

### Coming Soon

| Feature | Status |
|---------|--------|
| **Settings Page** | UI placeholder exists in navbar, page not yet built |
| **Landing/Marketing Page** | Designed in spec — cozy hero, app screenshot, Google sign-in CTA |
| **Light Mode** | Theme switching infrastructure planned, currently dark-only |
| **Browser Notifications** | Notify when focus/break rounds complete |
| **Lottie Bear Animations** | Current SVGs are Lottie-ready — swap in animated Lottie files for richer companion expressions |
| **Space Default Sound Auto-Apply** | Data structure exists — auto-switch sounds when changing spaces |
| **Session Save on Tab Close** | `beforeunload` trigger for saving partial sessions |
| **Ko-fi Support Link** | Support-the-dev link planned for settings/footer |

### Future Vision

| Feature | Description |
|---------|-------------|
| **Custom Spaces** | User-created environments with custom wallpapers and palettes |
| **Expanded Sound Library** | More ambient tracks beyond the initial 6 |
| **Monthly/Yearly Analytics** | Extended stats views with trends and insights |
| **PWA / Mobile App** | Offline-capable progressive web app or native wrapper |
| **Public Profiles** | Share focus stats and streaks with others |
| **Focus Groups** | Co-focus rooms with shared timers and ambient sounds |
| **Spotify Integration** | Connect your Spotify for focus playlists alongside ambient sounds |

---

## Contributing

Contributions are welcome! This project is under active development.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with &#x2764;&#xfe0f; by <a href="https://github.com/saifmohamedsv">Saif Mohamed</a>
</p>
