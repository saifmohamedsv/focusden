# Destract V1 — Full Implementation Design

A cozy focus platform for distracted people. Pomodoro timer, ambient sounds, notes, todos, companion bear, and curated "spaces" — all on one screen with a warm dark olive/amber aesthetic.

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Full V1, all features, no MVP cut | User wants complete product on stages |
| Timeline | Part-time, ~6 weeks across 4 stages | Realistic for part-time work |
| UI framework | Chakra UI v3 + custom design tokens | Custom theme recipes support the distinctive aesthetic; theme switching infrastructure |
| State | Zustand + IndexedDB persistence | Offline-first, survives refresh, lightweight |
| Auth | NextAuth.js v5 (Google OAuth) | Separate from DB layer, clean concerns |
| Database | Supabase (Postgres + RLS) | Session analytics benefit from SQL aggregation; free tier generous |
| Audio | Howler.js, multi-track layered mixing | Per-track volume, simultaneous playback, crossfade support |
| Wallpapers | Curated static images bundled in repo | Controlled aesthetic, no API dependency |
| Companion | Placeholder SVGs, Lottie-ready structure | No assets yet; swap in animations later |
| Implementation | 4-stage parallel verticals with agent orchestra | Fastest realistic path using all agents |

---

## Architecture

### Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components where appropriate)
- **UI:** Chakra UI v3 with custom theme + design tokens (warm olive/amber palette)
- **State:** Zustand with IndexedDB persistence (zustand/middleware + idb-keyval)
- **Audio:** Howler.js (multi-track layered playback with per-track volume)
- **Auth:** NextAuth.js v5 with Google OAuth provider
- **Database:** Supabase (Postgres + RLS policies)
- **Animation:** Framer Motion (transitions), placeholder SVGs for companion
- **Drag & Drop:** dnd-kit (todo reordering)
- **Validation:** Zod (API payloads)
- **Deployment:** Vercel

### Layout — 3-Column Design

```
+--------+---------------------------+--------------+
| Nav    |     Focus Workspace       |  Right Panel  |
| bar    |                           |              |
|        |  Space name + mood pills  |  Companion   |
| icons  |  Pomodoro ring timer      |  bear area   |
|        |  Timer controls           |              |
|        |                           |  Sound mixer |
|        |  +---------+-----------+  |  sliders     |
|        |  | Notes   | Todos     |  |              |
|        |  +---------+-----------+  |  Spaces grid |
| gear   |                           |              |
| avatar |                           |              |
+--------+---------------------------+--------------+
```

### Design Token System

CSS custom properties driven by the active space palette:

- Base theme: dark olive background, amber accents, warm gray surfaces
- Each space defines a palette override in its `palette_json`
- On space switch: CSS variables transition smoothly to new palette
- Dark-first design, with theme switching infrastructure for future light mode
- Chakra component recipes override defaults to match the cozy aesthetic

### Folder Structure

```
app/
  (auth)/              # login, landing page
  (dashboard)/         # main focus workspace (protected)
  api/
    auth/[...nextauth]/
    spaces/
    sessions/
components/
  layout/              # NavBar, RightPanel, WorkspaceLayout
  timer/               # PomodoroRing, TimerControls
  notes/               # NotesPanel
  todos/               # TodoList, TodoItem
  sounds/              # SoundMixer, SoundSlider
  companion/           # CompanionBear, state animations
  spaces/              # SpaceCard, SpaceGrid, SpaceBackground
  mood/                # MoodPicker
  session/             # SessionSummary, StatsChart
  ui/                  # Shared themed primitives
lib/
  supabase/            # client, schema, migrations
  auth/                # NextAuth config
  sounds/              # audio manager, track configs
store/
  index.ts             # combined Zustand store
  slices/              # timer, notes, todos, sound, companion, space, session
hooks/                 # useTimer, useAudio, useIdle, useHydration
types/                 # shared TypeScript interfaces
public/
  sounds/              # .mp3 ambient loops
  wallpapers/          # curated space backgrounds
  companion/           # SVG/Lottie assets
```

### Supabase Schema

**users**
- id (uuid, PK)
- google_id (text, unique)
- email (text)
- display_name (text)
- created_at (timestamptz)

**spaces**
- id (uuid, PK)
- name (text)
- category (text)
- wallpaper_path (text)
- palette_json (jsonb) — color tokens for this space
- default_sounds_json (jsonb) — which tracks play by default and at what volume
- companion_theme (text)

**sessions**
- id (uuid, PK)
- user_id (uuid, FK → users)
- space_id (uuid, FK → spaces)
- project_name (text)
- mood (text)
- duration_minutes (integer)
- todos_completed (integer)
- started_at (timestamptz)
- ended_at (timestamptz)

**RLS policies:** Users can only read/write their own sessions. Spaces are readable by all authenticated users.

### Zustand Store Shape

```typescript
interface AppStore {
  // Timer
  timerStatus: 'idle' | 'running' | 'paused' | 'break';
  timeRemaining: number;
  workDuration: number;
  breakDuration: number;
  currentRound: number;

  // Space
  activeSpaceId: string | null;
  spaces: Space[];

  // Notes
  notesContent: string;

  // Todos
  todos: Todo[]; // { id, text, completed, order }

  // Sound
  soundTracks: SoundTrack[]; // { id, name, volume, enabled }

  // Companion
  companionState: 'working' | 'celebrating' | 'idle' | 'stretching';

  // Session
  mood: 'focused' | 'calm' | 'anxious' | 'restless' | null;
  projectName: string;
  sessionStartedAt: number | null;
}
```

Persisted to IndexedDB via `zustand/middleware` + `idb-keyval`. Hydration guard prevents SSR/client mismatch.

---

## Implementation Stages

### Stage 1: Foundation (Week 1)

Single sequential workstream. Everything else depends on this.

**Tasks:**
1. Init Next.js 15 project with App Router, TypeScript, Tailwind
2. Install all dependencies (Chakra UI v3, Framer Motion, Zustand, idb-keyval, Howler.js, NextAuth.js v5, Supabase JS, dnd-kit, Zod)
3. Build Chakra custom theme with design tokens:
   - Color tokens matching warm olive/amber palette
   - Typography scale
   - Component recipes (Button, Slider, Input, Card)
   - CSS custom properties for space-driven palette switching
   - Semantic tokens responding to `data-space` attribute
4. Scaffold full folder structure
5. Set up Supabase project with schema migrations (users, spaces, sessions tables + RLS)
6. Create seed data: 8-10 curated spaces with wallpapers, palettes, default sound configs
7. Create `.env.local` template with all required keys
8. Configure ESLint + Prettier

**Agent pipeline:** tech-lead-frontend (plan) → staff-frontend-engineer (build) → tech-lead-frontend (review)

**Exit criteria:** `npm run dev` shows a blank themed page with correct olive/amber palette. Supabase schema deployed. Env vars documented.

---

### Stage 2: Core Experience (Week 2-3)

Three parallel workstreams in isolated worktrees.

#### Workstream A: Layout Shell + Spaces

- 3-column responsive layout (NavBar | Workspace | RightPanel)
- Nav bar with icon buttons + settings gear + user avatar placeholder
- `SpaceBackground` — full-bleed wallpaper with overlay gradient
- `SpaceGrid` in right panel — thumbnail cards for 8-10 spaces
- Space switching — wallpaper crossfade (Framer Motion), CSS variables morph to new palette
- Curate and bundle 8-10 high-quality dark/cozy wallpapers in `public/wallpapers/`

#### Workstream B: Timer + Notes + Todos

- `useTimer` hook with `useRef` interval. States: idle, running, paused, break. Default: 25min work / 5min break (adjustable by mood selection, user can also manually override)
- SVG ring progress with amber stroke
- Timer controls: reset, play/pause, skip
- Mood picker: "Feeling" pills (Focused, Calm, Anxious, Restless). Adjusts defaults:
    - Focused: 25min work / 5min break, energizing sounds (cafe, forest)
    - Calm: 30min work / 7min break, gentle sounds (rain, waves)
    - Anxious: 15min work / 5min break, grounding sounds (rain, delta)
    - Restless: 10min work / 3min break, stimulating sounds (cafe, fire)
- Notes panel: textarea with debounced auto-save to Zustand
- Todo list: add/check/delete, drag reorder (dnd-kit), completed count for stats
- Project name text field

#### Workstream C: Zustand Store + Persistence

- Combined store with all slices (timer, space, notes, todos, sound, companion, session)
- IndexedDB persistence middleware via idb-keyval
- `useHydration` hook with `hasHydrated` flag — blocks render until store loads

**Merge point:** Integrate all three — layout renders timer/notes/todos, spaces switch palettes, everything persists across refresh.

**Exit criteria:** Full 3-column layout. Timer counts down with ring animation. Notes and todos survive refresh. Space switching changes wallpaper and palette.

---

### Stage 3: Enrichment (Week 3-4)

Three parallel workstreams in isolated worktrees.

#### Workstream A: Auth + Protected Routes

- NextAuth.js v5 with Google provider (`app/api/auth/[...nextauth]/route.ts`)
- Supabase adapter: upsert user row on first login
- Next.js middleware: protect `/app/*` routes, redirect to landing
- Auth-gated layout wrapper with loading state
- Landing page: cozy hero, app screenshot, Google sign-in button, warm olive/amber palette
- User avatar in nav bar from Google profile

#### Workstream B: Ambient Sound System

- Source and bundle 6 free-license `.mp3` loops: Rain, Waves, Cafe, Fire, Forest, Delta/Theta binaural (2-4MB each, seamless loop)
- `useAudio` hook (Howler.js wrapper): load all tracks, per-track play/pause/volume, multi-track simultaneous playback, crossfade on space switch, browser autoplay policy handling
- `SoundMixer` panel: emoji icon + name + horizontal slider + active dot per track, amber slider thumbs
- Space default sound presets: on space switch, apply `default_sounds_json`. User overrides persist in Zustand

#### Workstream C: Companion Bear

- SVG placeholder illustrations for 4 states: working (bear at desk), celebrating (happy bear), idle/yawning (drowsy bear), break/stretching (relaxed bear)
- `CompanionBear` component: renders current state SVG with CSS transitions
- State machine via `companionSlice`: running→working, complete→celebrating(3s)→stretching, break→stretching, idle 5min→yawning
- `useIdle` hook: tracks last interaction, fires after 5min, resets on mouse/keyboard
- "YOUR BUDDY" label + speech bubble with status text
- Component accepts SVG or Lottie source — ready for asset swap later

**Merge point:** Auth wraps entire app. Sounds play alongside sessions. Companion reacts to timer.

**Exit criteria:** Google sign-in end-to-end. Landing page for unauthenticated. Multi-track sound mixing with individual volume. Companion transitions between all 4 states.

---

### Stage 4: Integration & Polish (Week 5-6)

More sequential — depends on all prior stages merged.

#### 4A: Session Saving & Stats

- `POST /api/sessions` — Zod-validated, called on session end or `beforeunload`. Payload: user_id, space_id, project_name, mood, duration_minutes, todos_completed, started_at, ended_at
- `GET /api/sessions/stats` — aggregates: total focus time, current streak, most used space, projects this week, session count
- Session end flow: stop/complete → celebration summary card (Framer Motion): time focused, todos done, streak, space
- "I need 5 minutes" quick-start: prominent button, skips mood/project, starts 5min Pomodoro in last used space

#### 4B: Stats Dashboard

- Route `/app/stats` accessible from nav
- Weekly focus bar chart (custom SVG or lightweight Chart.js)
- Streak calendar heatmap
- Top projects by focus time
- Most used spaces with thumbnails

#### 4C: Framer Motion Polish

- Space switch: wallpaper crossfade (opacity + subtle scale)
- Panel slide-ins: notes/todos from bottom
- Timer ring: smooth stroke-dashoffset
- Mood picker: pill entrance stagger
- Session summary: card scale-up from center
- Companion state transitions: SVG morph
- All animations < 300ms, respect `prefers-reduced-motion`

#### 4D: Mobile Responsiveness

- Desktop (1024+): full 3-column layout
- Tablet (768-1023): right panel collapses to bottom drawer (swipe up)
- Mobile (< 768): single column, bottom nav, timer as hero, notes/todos in tabs, sound mixer slide-up sheet
- Timer controls thumb-reachable, touch-friendly slider hit areas

#### 4E: Accessibility & Final Polish

- Keyboard navigation with visible focus rings on all interactive elements
- `aria-live="polite"` on timer (time remaining, state changes)
- `aria-label` and `aria-valuetext` on sound sliders
- Semantic HTML (`nav`, `main`, `aside`, `section`)
- `prefers-reduced-motion` disables all Framer animations
- Ko-fi "support the dev" link in settings/footer
- OG image + meta tags via Next.js metadata API
- CLAUDE.md documenting all project conventions

**Parallel tracks:** 4A+4B run alongside 4C+4D. 4E is a final pass after everything.

**Exit criteria:** Full end-to-end flow — sign in → pick space → set mood → start Pomodoro → notes + todos → ambient sounds → companion reacts → session ends → summary card → stats page. Works on desktop and mobile. Keyboard accessible.

---

## Agent Orchestration

### Per-Workstream Pipeline

Every workstream follows the 5-phase workflow:

1. **Requirements** (product-owner) — only if requirements are vague
2. **Architecture** (tech-lead-frontend) — plan for the workstream
3. **Implementation** (staff-frontend-engineer) — build in isolated worktree
4. **Review** (tech-lead-frontend, review mode) — severity-based findings. CRITICAL → back to step 3. APPROVED → merge
5. **Knowledge capture** — persist conventions and decisions to CLAUDE.md

### Parallel Execution

- **Stage 1:** Single sequential pipeline
- **Stages 2 & 3:** Three parallel pipelines each, isolated worktrees under `.claude/worktrees/`
- **Stage 4:** Two parallel tracks (4A+4B and 4C+4D), then final 4E pass

### Human Review Checkpoints

| Checkpoint | What to review | When |
|------------|---------------|------|
| After Stage 1 | Theme correct? Palette matches vision? Dev server runs? | End of Week 1 |
| After Stage 2 | Layout feels like mockup? Timer/notes/todos work? | End of Week 3 |
| After Stage 3 | Sign-in works? Sounds play? Bear reacts? | End of Week 4 |
| After Stage 4 | End-to-end flow? Mobile? Ship it? | End of Week 6 |

Between checkpoints, agents handle architecture, implementation, and code review autonomously. User commits are always explicit — never autonomous.
