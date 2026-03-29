# Stage 4: Integration & Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the end-to-end focus session flow with persistence, stats, animations, mobile responsiveness, and accessibility — making FocusDen ship-ready.

**Architecture:** Two parallel tracks (4A+4B sessions/stats, 4C+4D motion/mobile) then a final 4E accessibility pass. Executed sequentially via subagents.

**Tech Stack:** Supabase (session persistence), Zod (validation), Framer Motion (animations), custom SVG charts, Next.js metadata API

**Spec:** `docs/superpowers/specs/2026-03-29-destract-v1-design.md` (Stage 4 section)

---

## File Structure

```
Created:
  app/api/sessions/route.ts              — POST session endpoint
  app/api/sessions/stats/route.ts        — GET aggregated stats
  app/(dashboard)/stats/page.tsx         — Stats dashboard page
  components/session/SessionSummary.tsx   — End-of-session celebration card
  components/session/QuickStart.tsx       — "I need 5 minutes" button
  components/stats/WeeklyChart.tsx        — SVG bar chart
  components/stats/StreakCalendar.tsx      — Heatmap calendar
  components/stats/TopProjects.tsx        — Ranked project list

Modified:
  store/slices/timerSlice.ts             — auto-start session on timer start
  store/slices/sessionSlice.ts           — track session start/end for saving
  hooks/useTimer.ts                      — trigger session save on complete
  app/(dashboard)/page.tsx               — add QuickStart, SessionSummary, motion wrappers
  components/layout/WorkspaceLayout.tsx  — responsive grid breakpoints
  components/layout/NavBar.tsx           — mobile bottom nav, stats link
  components/layout/RightPanel.tsx       — mobile drawer
  components/spaces/SpaceBackground.tsx  — crossfade animation
  components/companion/CompanionBear.tsx — state transition animation
  components/mood/MoodPicker.tsx         — pill entrance animation
  app/layout.tsx                         — OG meta tags
```

---

### Task 1: Session API Endpoints

**Files:**
- Create: `app/api/sessions/route.ts`
- Create: `app/api/sessions/stats/route.ts`

- [ ] **Step 1: Create POST /api/sessions endpoint**

```typescript
// app/api/sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/config";
import { createServerSupabase } from "@/lib/supabase/server";

const sessionSchema = z.object({
  space_id: z.string().uuid(),
  project_name: z.string().default(""),
  mood: z.enum(["focused", "calm", "anxious", "restless"]).nullable(),
  duration_minutes: z.number().int().min(0),
  todos_completed: z.number().int().min(0),
  started_at: z.string(),
  ended_at: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // Get or create user
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { error } = await supabase.from("sessions").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Create GET /api/sessions/stats endpoint**

```typescript
// app/api/sessions/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Total focus time
  const { data: totalData } = await supabase
    .from("sessions")
    .select("duration_minutes")
    .eq("user_id", user.id);

  const totalMinutes = totalData?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0;

  // Session count
  const sessionCount = totalData?.length ?? 0;

  // Current streak (consecutive days with sessions)
  const { data: dateData } = await supabase
    .from("sessions")
    .select("started_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });

  let streak = 0;
  if (dateData && dateData.length > 0) {
    const dates = [...new Set(dateData.map((s) => s.started_at.split("T")[0]))];
    const today = new Date().toISOString().split("T")[0];
    let checkDate = today;
    for (const date of dates) {
      if (date === checkDate) {
        streak++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split("T")[0];
      } else if (date < checkDate) {
        break;
      }
    }
  }

  // Projects this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { data: weekData } = await supabase
    .from("sessions")
    .select("project_name, duration_minutes, space_id")
    .eq("user_id", user.id)
    .gte("started_at", weekAgo.toISOString());

  const projects = [...new Set(weekData?.map((s) => s.project_name).filter(Boolean) ?? [])];

  // Most used space
  const spaceCounts: Record<string, number> = {};
  totalData?.forEach((s: { space_id?: string }) => {
    if (s.space_id) spaceCounts[s.space_id] = (spaceCounts[s.space_id] || 0) + 1;
  });
  // Note: totalData from the first query doesn't have space_id, need separate query
  const { data: spaceData } = await supabase
    .from("sessions")
    .select("space_id")
    .eq("user_id", user.id);

  const spaceCountsFixed: Record<string, number> = {};
  spaceData?.forEach((s) => {
    spaceCountsFixed[s.space_id] = (spaceCountsFixed[s.space_id] || 0) + 1;
  });
  const mostUsedSpace = Object.entries(spaceCountsFixed).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Weekly breakdown (last 7 days)
  const weeklyBreakdown: { date: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayMinutes = weekData
      ?.filter((s) => s.started_at?.startsWith(dateStr))
      ?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0;
    weeklyBreakdown.push({ date: dateStr, minutes: dayMinutes });
  }

  return NextResponse.json({
    total_focus_minutes: totalMinutes,
    current_streak: streak,
    most_used_space: mostUsedSpace,
    projects_this_week: projects,
    session_count: sessionCount,
    weekly_breakdown: weeklyBreakdown,
  });
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/api/sessions/
git commit -m "feat: add session save and stats API endpoints with Zod validation"
```

---

### Task 2: Session Summary + Quick Start

**Files:**
- Create: `components/session/SessionSummary.tsx`
- Create: `components/session/QuickStart.tsx`
- Modify: `app/(dashboard)/page.tsx`

- [ ] **Step 1: Create SessionSummary card**

A celebration card shown after a session ends (different from TransitionCard — this is a final summary, not mid-timer). Shows: total focus time this session, todos completed, current streak, space used. Dismiss button returns to idle state.

- [ ] **Step 2: Create QuickStart button**

"I need 5 minutes" button shown when timer is idle. Skips mood/project, starts a 5min Pomodoro immediately in the last used space. Styled as a subtle pill below the timer controls.

- [ ] **Step 3: Wire into dashboard**

Show QuickStart below TimerControls when idle. SessionSummary can be triggered after the transition card flow completes a full session (all 4 rounds done).

- [ ] **Step 4: Commit**

```bash
git add components/session/ "app/(dashboard)/page.tsx"
git commit -m "feat: add session summary celebration card and quick-start button"
```

---

### Task 3: Stats Dashboard Page

**Files:**
- Create: `app/(dashboard)/stats/page.tsx`
- Create: `components/stats/WeeklyChart.tsx`
- Create: `components/stats/StreakCalendar.tsx`
- Create: `components/stats/TopProjects.tsx`
- Modify: `components/layout/NavBar.tsx` — add stats icon link

- [ ] **Step 1: Create WeeklyChart**

Custom SVG bar chart showing focus minutes per day for the last 7 days. Bars use accent color, labels show day abbreviations. Max height scales to tallest bar. Simple, warm-styled.

- [ ] **Step 2: Create StreakCalendar**

Heatmap-style calendar showing the last 30 days. Each day is a small rounded square. Color intensity maps to focus minutes (0 = dim, 60+ = full accent). Current streak highlighted.

- [ ] **Step 3: Create TopProjects**

Simple ranked list of projects by total focus time. Shows project name + total hours/minutes. Top 5.

- [ ] **Step 4: Create stats page**

Fetches data from `/api/sessions/stats` on mount. Shows:
- Header: "Your Focus" + total hours stat
- Current streak badge
- WeeklyChart
- StreakCalendar
- TopProjects
- Back to timer link

Use `useEffect` + `fetch` for data loading (client component). Loading skeleton while fetching.

- [ ] **Step 5: Add stats nav link**

Add a chart/stats icon to NavBar that links to `/stats`.

- [ ] **Step 6: Commit**

```bash
git add "app/(dashboard)/stats/" components/stats/ components/layout/NavBar.tsx
git commit -m "feat: add stats dashboard with weekly chart, streak calendar, top projects"
```

---

### Task 4: Framer Motion Polish

**Files:**
- Modify: `components/spaces/SpaceBackground.tsx` — wallpaper crossfade
- Modify: `components/companion/CompanionBear.tsx` — state transition fade
- Modify: `components/mood/MoodPicker.tsx` — pill entrance stagger
- Modify: `components/timer/TransitionCard.tsx` — card entrance animation
- Modify: `app/(dashboard)/page.tsx` — wrap sections in motion wrappers

- [ ] **Step 1: Add wallpaper crossfade**

In SpaceBackground, use Framer Motion `AnimatePresence` + `motion.div` for crossfade on wallpaper change. Key by `activeSpaceId`. Fade duration 600ms.

- [ ] **Step 2: Add companion state transition**

Wrap bear SVG in `AnimatePresence` with `motion.div`. Fade between states with 300ms duration.

- [ ] **Step 3: Add mood pill entrance**

Use `motion.div` with `initial={{ opacity: 0, y: 8 }}` and stagger children by 50ms on mount.

- [ ] **Step 4: Add transition card entrance**

Wrap TransitionCard in `motion.div` with `initial={{ opacity: 0, scale: 0.95 }}` animate to full.

- [ ] **Step 5: Add `prefers-reduced-motion` check**

Create a `useReducedMotion` hook or use Framer's built-in. When true, all animations resolve instantly (duration: 0).

- [ ] **Step 6: Commit**

```bash
git add components/ hooks/ "app/(dashboard)/"
git commit -m "feat: add Framer Motion animations with prefers-reduced-motion support"
```

---

### Task 5: Mobile Responsiveness

**Files:**
- Modify: `components/layout/WorkspaceLayout.tsx` — responsive grid
- Modify: `components/layout/NavBar.tsx` — bottom nav on mobile
- Modify: `components/layout/RightPanel.tsx` — drawer on mobile
- Modify: `app/(dashboard)/page.tsx` — responsive spacing

- [ ] **Step 1: Make WorkspaceLayout responsive**

- Desktop (1024+): `64px 1fr 320px` grid (current)
- Tablet (768-1023): `64px 1fr` grid, right panel becomes a slide-up drawer triggered by a button
- Mobile (<768): single column, no sidebar. Bottom nav replaces left nav. Right panel content in a full-screen slide-up sheet.

Use Chakra's `useBreakpointValue` or CSS media queries.

- [ ] **Step 2: Mobile bottom nav**

On mobile, NavBar renders as a horizontal bottom bar: timer, spaces, notes, todos, stats icons. Fixed to bottom, 56px height.

- [ ] **Step 3: Right panel drawer**

On tablet/mobile, RightPanel renders as a drawer that slides up from bottom. Triggered by a button in the nav. Contains companion, sound mixer, space grid.

- [ ] **Step 4: Touch-friendly controls**

- Timer controls: increase hit areas to 48px minimum
- Sound sliders: increase slider thumb to 20px, track to 6px
- Dock buttons: increase touch targets

- [ ] **Step 5: Commit**

```bash
git add components/layout/ "app/(dashboard)/"
git commit -m "feat: add mobile responsive layout with bottom nav and drawer"
```

---

### Task 6: Accessibility & Final Polish

**Files:**
- Modify: multiple component files — add ARIA attributes
- Modify: `app/layout.tsx` — OG meta tags
- Create: `CLAUDE.md` (project root) — document conventions

- [ ] **Step 1: Timer accessibility**

- `aria-live="polite"` on timer display region — announces time changes
- `aria-label` on all timer control buttons (already present, verify)
- Timer stepper: `role="spinbutton"` with `aria-valuemin`/`aria-valuemax`/`aria-valuenow`

- [ ] **Step 2: Sound mixer accessibility**

- Each slider: `aria-label="Rain volume"`, `aria-valuetext="60%"`
- Toggle dots: `role="switch"`, `aria-checked`

- [ ] **Step 3: Keyboard navigation**

- Visible focus rings on all interactive elements (already in button recipe, verify on native buttons)
- Tab order: logical flow through nav → workspace → right panel
- Escape closes floating panel (already implemented)

- [ ] **Step 4: Semantic HTML**

- `<nav>` for NavBar (verify)
- `<main>` for workspace center (verify)
- `<aside>` for RightPanel (verify)
- `<section>` for distinct content areas

- [ ] **Step 5: OG meta tags**

Update `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: "FocusDen — Focus, Flow, Feel Good",
  description: "A cozy focus platform with Pomodoro timer, ambient sounds, and a companion to keep you company while you work.",
  openGraph: {
    title: "FocusDen — Focus, Flow, Feel Good",
    description: "A cozy focus platform with Pomodoro timer, ambient sounds, and a companion to keep you company.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusDen — Focus, Flow, Feel Good",
    description: "A cozy focus platform with Pomodoro timer, ambient sounds, and a companion to keep you company.",
  },
};
```

- [ ] **Step 6: Update CLAUDE.md with project conventions**

Create/update `CLAUDE.md` at project root documenting:
- Tech stack decisions
- Chakra v3 patterns (type casting for custom variants, native inputs)
- Store architecture (Zustand slices, IndexedDB persistence)
- Component patterns (inline SVG icons, FloatingPanel portal)
- Design tokens (semantic colors, space-scoped vars)

- [ ] **Step 7: Commit**

```bash
git add components/ app/ CLAUDE.md
git commit -m "feat: add accessibility, OG meta tags, and project conventions doc"
```

---

## Stage 4 Exit Criteria

- [ ] Session saves to Supabase on focus complete (POST /api/sessions)
- [ ] Stats endpoint returns aggregated data (GET /api/sessions/stats)
- [ ] Quick-start "I need 5 minutes" works from idle state
- [ ] Stats page shows weekly chart, streak calendar, top projects
- [ ] Wallpaper crossfade animation on space switch
- [ ] Companion fades between states
- [ ] Mood pills stagger in on mount
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Mobile: single column with bottom nav, drawer for right panel
- [ ] Tablet: two column with collapsible right panel
- [ ] All interactive elements keyboard-navigable
- [ ] Timer has aria-live announcements
- [ ] Sound sliders have proper ARIA labels
- [ ] OG meta tags set
- [ ] `npm run build` succeeds
- [ ] CLAUDE.md documents project conventions

**Final checkpoint:** Full end-to-end flow — sign in → pick space → set mood → start Pomodoro → notes + todos → ambient sounds → companion reacts → session ends → summary → stats page. Works on desktop and mobile. Keyboard accessible. Ship it.
