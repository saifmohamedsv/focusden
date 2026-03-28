# Destract V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cozy focus platform with Pomodoro timer, ambient sounds, notes, todos, companion bear, and curated spaces — shipped in 4 stages over ~6 weeks (part-time).

**Architecture:** Next.js 15 App Router with Chakra UI v3 custom theme, Zustand + IndexedDB for state, Supabase for persistence, Howler.js for multi-track audio. 3-column layout: nav | workspace | right panel. Agent orchestra handles parallel workstreams per stage.

**Tech Stack:** Next.js 15, Chakra UI v3, Zustand, idb-keyval, Howler.js, NextAuth.js v5, Supabase, Framer Motion, dnd-kit, Zod

**Spec:** `docs/superpowers/specs/2026-03-29-destract-v1-design.md`

---

## File Structure Map (All Stages)

```
app/
  layout.tsx                         # Root layout with Chakra provider        [Stage 1]
  page.tsx                           # Landing page (public)                   [Stage 3]
  providers.tsx                      # Chakra + session providers              [Stage 1]
  globals.css                        # CSS custom properties for palettes      [Stage 1]
  (auth)/
    login/page.tsx                   # Login page                              [Stage 3]
  (dashboard)/
    layout.tsx                       # Auth-gated dashboard layout             [Stage 3]
    page.tsx                         # Main focus workspace                    [Stage 2]
    stats/page.tsx                   # Stats dashboard                         [Stage 4]
  api/
    auth/[...nextauth]/route.ts      # NextAuth API route                     [Stage 3]
    spaces/route.ts                  # GET /api/spaces                        [Stage 2]
    sessions/route.ts                # POST /api/sessions                     [Stage 4]
    sessions/stats/route.ts          # GET /api/sessions/stats                [Stage 4]

components/
  layout/
    NavBar.tsx                       # Left icon nav bar                       [Stage 2A]
    RightPanel.tsx                   # Right sidebar container                 [Stage 2A]
    WorkspaceLayout.tsx              # 3-column grid wrapper                   [Stage 2A]
  timer/
    PomodoroRing.tsx                 # SVG ring progress                       [Stage 2B]
    TimerControls.tsx                # Play/pause/reset/skip buttons           [Stage 2B]
    TimerDisplay.tsx                 # Time + label display                    [Stage 2B]
  notes/
    NotesPanel.tsx                   # Notes textarea with auto-save           [Stage 2B]
  todos/
    TodoList.tsx                     # Todo list with drag reorder             [Stage 2B]
    TodoItem.tsx                     # Single todo row                         [Stage 2B]
  sounds/
    SoundMixer.tsx                   # Sound mixer panel                       [Stage 3B]
    SoundSlider.tsx                  # Individual sound row + slider           [Stage 3B]
  companion/
    CompanionBear.tsx                # Bear component with state switching     [Stage 3C]
    BearWorking.tsx                  # SVG: bear at desk                       [Stage 3C]
    BearCelebrating.tsx              # SVG: happy bear                         [Stage 3C]
    BearIdle.tsx                     # SVG: drowsy bear                        [Stage 3C]
    BearStretching.tsx               # SVG: relaxed bear                       [Stage 3C]
    SpeechBubble.tsx                 # Status text bubble                      [Stage 3C]
  spaces/
    SpaceCard.tsx                    # Space thumbnail card                    [Stage 2A]
    SpaceGrid.tsx                    # Grid of space cards                     [Stage 2A]
    SpaceBackground.tsx              # Full-bleed wallpaper + gradient         [Stage 2A]
  mood/
    MoodPicker.tsx                   # Feeling pills row                       [Stage 2B]
  session/
    SessionSummary.tsx               # End-of-session celebration card         [Stage 4]
    QuickStart.tsx                   # "I need 5 minutes" button               [Stage 4]
    ProjectNameInput.tsx             # Session project name field              [Stage 2B]
  stats/
    WeeklyChart.tsx                  # Bar chart of weekly focus               [Stage 4]
    StreakCalendar.tsx                # Heatmap calendar                        [Stage 4]
    TopProjects.tsx                  # Ranked project list                     [Stage 4]

lib/
  supabase/
    client.ts                        # Browser Supabase client                [Stage 1]
    server.ts                        # Server-side Supabase client            [Stage 1]
    migrations/
      001_create_users.sql           # Users table + RLS                      [Stage 1]
      002_create_spaces.sql          # Spaces table + RLS                     [Stage 1]
      003_create_sessions.sql        # Sessions table + RLS                   [Stage 1]
    seed.sql                         # Space seed data                        [Stage 1]
  auth/
    config.ts                        # NextAuth configuration                 [Stage 3]
  sounds/
    tracks.ts                        # Track metadata + file paths            [Stage 3B]
    presets.ts                        # Mood → sound preset mapping           [Stage 3B]

store/
  index.ts                           # Combined store with persist            [Stage 2C]
  slices/
    timerSlice.ts                    # Timer state + actions                   [Stage 2C]
    spaceSlice.ts                    # Active space + catalog                  [Stage 2C]
    notesSlice.ts                    # Notes content                           [Stage 2C]
    todosSlice.ts                    # Todo items + reorder                    [Stage 2C]
    soundSlice.ts                    # Sound track configs                     [Stage 2C]
    companionSlice.ts                # Companion state                         [Stage 2C]
    sessionSlice.ts                  # Session metadata                        [Stage 2C]

hooks/
  useTimer.ts                        # Pomodoro timer logic                   [Stage 2B]
  useAudio.ts                        # Howler.js multi-track manager          [Stage 3B]
  useIdle.ts                         # Idle detection (5min)                  [Stage 3C]
  useHydration.ts                    # IndexedDB hydration guard              [Stage 2C]

types/
  index.ts                           # Shared TypeScript interfaces           [Stage 1]

theme/
  index.ts                           # createSystem config                    [Stage 1]
  tokens/
    colors.ts                        # Color token definitions                [Stage 1]
    typography.ts                    # Font tokens                            [Stage 1]
  recipes/
    button.ts                        # Button recipe                          [Stage 1]
    card.ts                          # Card recipe                            [Stage 1]
    input.ts                         # Input recipe                           [Stage 1]
    slider.ts                        # Slider recipe                          [Stage 1]
  palettes.ts                        # Space palette CSS variable maps        [Stage 1]

public/
  wallpapers/                        # 8-10 curated dark/cozy images          [Stage 2A]
  sounds/                            # 6 ambient .mp3 loops                   [Stage 3B]
  companion/                         # SVG bear assets                        [Stage 3C]
```

---

## Stage 1: Foundation (Week 1)

> **Agent pipeline:** task-orchestrator → tech-lead-frontend (plan) → staff-frontend-engineer (build) → tech-lead-frontend (review)

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `app/layout.tsx`, `app/page.tsx`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`

- [ ] **Step 1: Create Next.js 15 project**

```bash
npx create-next-app@latest destract-app --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted:
- Would you like to use TypeScript? **Yes**
- Would you like to use ESLint? **Yes**
- Would you like to use Tailwind CSS? **Yes**
- Would you like your code inside a `src/` directory? **No**
- Would you like to use App Router? **Yes**
- Would you like to use Turbopack? **Yes**
- Would you like to customize the import alias? **Yes** → `@/*`

- [ ] **Step 2: Move generated files to project root**

```bash
# Move all generated files from destract-app/ into the project root
cp -r destract-app/* destract-app/.* . 2>/dev/null
rm -rf destract-app
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts on `http://localhost:3000`, Next.js welcome page renders.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: init Next.js 15 project with App Router, TypeScript, Tailwind"
```

---

### Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Chakra UI v3 + Framer Motion**

```bash
npm install @chakra-ui/react @emotion/react framer-motion
```

- [ ] **Step 2: Install state management + persistence**

```bash
npm install zustand idb-keyval
```

- [ ] **Step 3: Install auth + database**

```bash
npm install next-auth@5 @supabase/supabase-js
```

- [ ] **Step 4: Install utilities**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities zod howler
npm install -D @types/howler
```

- [ ] **Step 5: Verify clean install**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install core dependencies (Chakra, Zustand, NextAuth, Supabase, Howler, dnd-kit)"
```

---

### Task 3: TypeScript Types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create shared type definitions**

Create `types/index.ts`:

```typescript
export interface Space {
  id: string;
  name: string;
  category: string;
  wallpaper_path: string;
  palette: SpacePalette;
  default_sounds: SoundPreset[];
  companion_theme: string;
}

export interface SpacePalette {
  bg_primary: string;
  bg_secondary: string;
  accent: string;
  accent_hover: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  surface: string;
}

export interface SoundPreset {
  track_id: string;
  volume: number;
  enabled: boolean;
}

export interface SoundTrack {
  id: string;
  name: string;
  icon: string;
  file: string;
  volume: number;
  enabled: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';

export type Mood = 'focused' | 'calm' | 'anxious' | 'restless';

export type CompanionState = 'working' | 'celebrating' | 'idle' | 'stretching';

export interface Session {
  id: string;
  user_id: string;
  space_id: string;
  project_name: string;
  mood: Mood | null;
  duration_minutes: number;
  todos_completed: number;
  started_at: string;
  ended_at: string;
}

export interface UserProfile {
  id: string;
  google_id: string;
  email: string;
  display_name: string;
  image?: string;
  created_at: string;
}

export interface SessionStats {
  total_focus_minutes: number;
  current_streak: number;
  most_used_space: string | null;
  projects_this_week: string[];
  session_count: number;
}

export const MOOD_CONFIGS: Record<Mood, { workMinutes: number; breakMinutes: number; sounds: string[] }> = {
  focused: { workMinutes: 25, breakMinutes: 5, sounds: ['cafe', 'forest'] },
  calm: { workMinutes: 30, breakMinutes: 7, sounds: ['rain', 'waves'] },
  anxious: { workMinutes: 15, breakMinutes: 5, sounds: ['rain', 'delta'] },
  restless: { workMinutes: 10, breakMinutes: 3, sounds: ['cafe', 'fire'] },
};
```

- [ ] **Step 2: Commit**

```bash
git add types/
git commit -m "feat: add shared TypeScript type definitions"
```

---

### Task 4: Chakra Theme System

**Files:**
- Create: `theme/tokens/colors.ts`
- Create: `theme/tokens/typography.ts`
- Create: `theme/recipes/button.ts`
- Create: `theme/recipes/card.ts`
- Create: `theme/recipes/input.ts`
- Create: `theme/recipes/slider.ts`
- Create: `theme/palettes.ts`
- Create: `theme/index.ts`

- [ ] **Step 1: Create color tokens**

Create `theme/tokens/colors.ts`:

```typescript
import { defineTokens } from "@chakra-ui/react";

export const colors = defineTokens.colors({
  // Base olive/brown scale
  olive: {
    50: { value: "#f5f3ee" },
    100: { value: "#e8e0d0" },
    200: { value: "#c9bfa8" },
    300: { value: "#a89a7e" },
    400: { value: "#8a7a5e" },
    500: { value: "#6b5d42" },
    600: { value: "#504530" },
    700: { value: "#3a3428" },
    800: { value: "#2a2620" },
    900: { value: "#1e1c16" },
    950: { value: "#14130e" },
  },
  // Amber accent scale
  amber: {
    50: { value: "#fef7ec" },
    100: { value: "#fcebc4" },
    200: { value: "#f9d68a" },
    300: { value: "#f0b94d" },
    400: { value: "#e8a32e" },
    500: { value: "#d4943a" },
    600: { value: "#b87420" },
    700: { value: "#96571c" },
    800: { value: "#7a441e" },
    900: { value: "#65381d" },
    950: { value: "#3b1c0c" },
  },
  // Muted greens for success/companion
  sage: {
    50: { value: "#f0f5f1" },
    100: { value: "#d5e5d8" },
    200: { value: "#aecdb5" },
    300: { value: "#7dae87" },
    400: { value: "#4a8b5a" },
    500: { value: "#3d7a4e" },
    600: { value: "#2f6240" },
    700: { value: "#264e34" },
    800: { value: "#1f3f2b" },
    900: { value: "#193425" },
    950: { value: "#0d1e14" },
  },
});
```

- [ ] **Step 2: Create typography tokens**

Create `theme/tokens/typography.ts`:

```typescript
import { defineTokens } from "@chakra-ui/react";

export const fonts = defineTokens.fonts({
  heading: { value: "'Inter', sans-serif" },
  body: { value: "'Inter', sans-serif" },
  mono: { value: "'JetBrains Mono', monospace" },
});

export const fontSizes = defineTokens.fontSizes({
  xs: { value: "0.75rem" },
  sm: { value: "0.8125rem" },
  md: { value: "0.875rem" },
  lg: { value: "1rem" },
  xl: { value: "1.125rem" },
  "2xl": { value: "1.5rem" },
  "3xl": { value: "2rem" },
  "4xl": { value: "3rem" },
  timer: { value: "4.5rem" },
});

export const fontWeights = defineTokens.fontWeights({
  normal: { value: "400" },
  medium: { value: "500" },
  semibold: { value: "600" },
  bold: { value: "700" },
});
```

- [ ] **Step 3: Create component recipes**

Create `theme/recipes/button.ts`:

```typescript
import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "medium",
    borderRadius: "lg",
    cursor: "pointer",
    transition: "all 0.2s",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "amber.400",
      outlineOffset: "2px",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "amber.500",
        color: "olive.950",
        _hover: { bg: "amber.400" },
        _active: { bg: "amber.600" },
      },
      ghost: {
        bg: "transparent",
        color: "olive.200",
        _hover: { bg: "olive.800" },
        _active: { bg: "olive.700" },
      },
      surface: {
        bg: "olive.800",
        color: "olive.100",
        border: "1px solid",
        borderColor: "olive.700",
        _hover: { bg: "olive.700" },
      },
    },
    size: {
      sm: { px: "3", py: "1.5", fontSize: "sm" },
      md: { px: "4", py: "2", fontSize: "md" },
      lg: { px: "6", py: "3", fontSize: "lg" },
      icon: { p: "2", fontSize: "lg" },
    },
  },
  defaultVariants: {
    variant: "ghost",
    size: "md",
  },
});
```

Create `theme/recipes/card.ts`:

```typescript
import { defineRecipe } from "@chakra-ui/react";

export const cardRecipe = defineRecipe({
  base: {
    bg: "olive.900/60",
    border: "1px solid",
    borderColor: "olive.700/50",
    borderRadius: "xl",
    backdropFilter: "blur(8px)",
  },
  variants: {
    variant: {
      default: {},
      elevated: {
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      },
    },
    size: {
      sm: { p: "3" },
      md: { p: "4" },
      lg: { p: "6" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

Create `theme/recipes/input.ts`:

```typescript
import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  base: {
    bg: "olive.800/50",
    border: "1px solid",
    borderColor: "olive.700/50",
    borderRadius: "lg",
    color: "olive.100",
    fontSize: "md",
    px: "3",
    py: "2",
    transition: "all 0.2s",
    _placeholder: { color: "olive.500" },
    _focus: {
      borderColor: "amber.500/50",
      outline: "none",
      boxShadow: "0 0 0 1px var(--chakra-colors-amber-500)",
    },
  },
});
```

Create `theme/recipes/slider.ts`:

```typescript
import { defineSlotRecipe } from "@chakra-ui/react";

export const sliderRecipe = defineSlotRecipe({
  slots: ["root", "track", "range", "thumb"],
  base: {
    root: {
      width: "full",
    },
    track: {
      bg: "olive.700",
      borderRadius: "full",
      height: "1.5",
    },
    range: {
      bg: "amber.500",
      borderRadius: "full",
    },
    thumb: {
      width: "3.5",
      height: "3.5",
      bg: "amber.400",
      borderRadius: "full",
      border: "2px solid",
      borderColor: "amber.500",
      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      cursor: "pointer",
      _hover: { bg: "amber.300" },
      _active: { transform: "scale(1.15)" },
    },
  },
});
```

- [ ] **Step 4: Create space palette system**

Create `theme/palettes.ts`:

```typescript
import { SpacePalette } from "@/types";

// Default palette (warm olive/amber — "Rainy Library" vibe)
export const defaultPalette: SpacePalette = {
  bg_primary: "#14130e",
  bg_secondary: "#1e1c16",
  accent: "#d4943a",
  accent_hover: "#e8a32e",
  text_primary: "#e8e0d0",
  text_secondary: "#8a7a5e",
  border: "#3a3428",
  surface: "#2a2620",
};

// Applies a space palette as CSS custom properties on :root
export function applyPalette(palette: SpacePalette): void {
  const root = document.documentElement;
  root.style.setProperty("--color-bg-primary", palette.bg_primary);
  root.style.setProperty("--color-bg-secondary", palette.bg_secondary);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-accent-hover", palette.accent_hover);
  root.style.setProperty("--color-text-primary", palette.text_primary);
  root.style.setProperty("--color-text-secondary", palette.text_secondary);
  root.style.setProperty("--color-border", palette.border);
  root.style.setProperty("--color-surface", palette.surface);
}

// Available space palettes — each space references one by ID
export const spacePalettes: Record<string, SpacePalette> = {
  "rainy-library": defaultPalette,
  "ocean-cabin": {
    bg_primary: "#0e1419",
    bg_secondary: "#141d24",
    accent: "#4a9bb5",
    accent_hover: "#5eb8d4",
    text_primary: "#d4e4ec",
    text_secondary: "#6a8a9e",
    border: "#243440",
    surface: "#1a2830",
  },
  "mountain-lodge": {
    bg_primary: "#16130f",
    bg_secondary: "#201c16",
    accent: "#c27a3a",
    accent_hover: "#d98f4e",
    text_primary: "#e8ddd0",
    text_secondary: "#8a755e",
    border: "#3a3020",
    surface: "#2a2418",
  },
  "zen-garden": {
    bg_primary: "#0e1410",
    bg_secondary: "#141e16",
    accent: "#5a9b6b",
    accent_hover: "#6bb87e",
    text_primary: "#d4e8da",
    text_secondary: "#6a9a7a",
    border: "#243a2a",
    surface: "#1a2e20",
  },
  "sunset-desert": {
    bg_primary: "#181210",
    bg_secondary: "#221a16",
    accent: "#d46a3a",
    accent_hover: "#e87e4e",
    text_primary: "#e8dcd4",
    text_secondary: "#9a7a6a",
    border: "#3a2a22",
    surface: "#2e2018",
  },
  "midnight-city": {
    bg_primary: "#0e0e14",
    bg_secondary: "#14141e",
    accent: "#7a6ad4",
    accent_hover: "#9488e8",
    text_primary: "#d8d4e8",
    text_secondary: "#7a7a9a",
    border: "#2a2a3a",
    surface: "#1e1e2e",
  },
  "autumn-cafe": {
    bg_primary: "#16120e",
    bg_secondary: "#201a14",
    accent: "#c4843a",
    accent_hover: "#d8984e",
    text_primary: "#e8dece",
    text_secondary: "#8a7a60",
    border: "#3a3020",
    surface: "#2a2418",
  },
  "northern-cabin": {
    bg_primary: "#101416",
    bg_secondary: "#161e22",
    accent: "#5a8aaa",
    accent_hover: "#6ea0c0",
    text_primary: "#d4dee8",
    text_secondary: "#6a8090",
    border: "#243038",
    surface: "#1a2830",
  },
};
```

- [ ] **Step 5: Create theme system entry point**

Create `theme/index.ts`:

```typescript
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./tokens/colors";
import { fonts, fontSizes, fontWeights } from "./tokens/typography";
import { buttonRecipe } from "./recipes/button";
import { cardRecipe } from "./recipes/card";
import { inputRecipe } from "./recipes/input";
import { sliderRecipe } from "./recipes/slider";

const config = defineConfig({
  theme: {
    tokens: {
      colors,
      fonts,
      fontSizes,
      fontWeights,
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "{colors.olive.950}" },
          secondary: { value: "{colors.olive.900}" },
          surface: { value: "{colors.olive.800}" },
        },
        fg: {
          DEFAULT: { value: "{colors.olive.100}" },
          muted: { value: "{colors.olive.400}" },
        },
        accent: {
          DEFAULT: { value: "{colors.amber.500}" },
          hover: { value: "{colors.amber.400}" },
          subtle: { value: "{colors.amber.500/20}" },
        },
        border: {
          DEFAULT: { value: "{colors.olive.700}" },
          subtle: { value: "{colors.olive.700/50}" },
        },
        success: {
          DEFAULT: { value: "{colors.sage.400}" },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
      card: cardRecipe,
      input: inputRecipe,
    },
    slotRecipes: {
      slider: sliderRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
```

- [ ] **Step 6: Commit**

```bash
git add theme/ types/
git commit -m "feat: add Chakra UI v3 theme system with olive/amber design tokens"
```

---

### Task 5: App Providers + Root Layout

**Files:**
- Create: `app/providers.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create providers wrapper**

Create `app/providers.tsx`:

```tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
```

- [ ] **Step 2: Set up globals.css with CSS custom properties**

Replace the contents of `app/globals.css`:

```css
@import "tailwindcss";

:root {
  /* Space palette CSS custom properties — overridden dynamically per space */
  --color-bg-primary: #14130e;
  --color-bg-secondary: #1e1c16;
  --color-accent: #d4943a;
  --color-accent-hover: #e8a32e;
  --color-text-primary: #e8e0d0;
  --color-text-secondary: #8a7a5e;
  --color-border: #3a3428;
  --color-surface: #2a2620;

  /* Smooth transitions when switching spaces */
  transition: --color-bg-primary 0.6s ease,
    --color-bg-secondary 0.6s ease,
    --color-accent 0.6s ease,
    --color-text-primary 0.6s ease;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: "Inter", sans-serif;
  overflow: hidden;
  height: 100vh;
}
```

- [ ] **Step 3: Update root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Destract — Focus, Flow, Feel Good",
  description:
    "A cozy focus platform with Pomodoro timer, ambient sounds, and a companion to keep you company while you work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create a themed test page**

Replace `app/page.tsx`:

```tsx
import { Box, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      minH="100vh"
      bg="bg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
    >
      <Heading color="accent" size="2xl">
        destract
      </Heading>
      <Text color="fg.muted" fontSize="lg">
        Focus, Flow, Feel Good
      </Text>
    </Box>
  );
}
```

- [ ] **Step 5: Verify themed page renders**

```bash
npm run dev
```

Expected: Page shows "destract" heading in amber color on dark olive background at `http://localhost:3000`.

- [ ] **Step 6: Run build to verify no type errors**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add app/ theme/
git commit -m "feat: wire up Chakra provider with themed root layout"
```

---

### Task 6: Supabase Client + Schema

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/migrations/001_create_users.sql`
- Create: `lib/supabase/migrations/002_create_spaces.sql`
- Create: `lib/supabase/migrations/003_create_sessions.sql`

- [ ] **Step 1: Create browser Supabase client**

Create `lib/supabase/client.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 2: Create server-side Supabase client**

Create `lib/supabase/server.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey);
}
```

- [ ] **Step 3: Create users table migration**

Create `lib/supabase/migrations/001_create_users.sql`:

```sql
-- Create users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  google_id text unique not null,
  email text not null,
  display_name text not null,
  image text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Users can read their own row
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid()::text = google_id);

-- Users can update their own row
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid()::text = google_id);

-- Service role can insert (used during auth callback)
create policy "Service role can insert users"
  on public.users for insert
  with check (true);
```

- [ ] **Step 4: Create spaces table migration**

Create `lib/supabase/migrations/002_create_spaces.sql`:

```sql
-- Create spaces table
create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  wallpaper_path text not null,
  palette_json jsonb not null,
  default_sounds_json jsonb not null default '[]'::jsonb,
  companion_theme text not null default 'default'
);

-- Enable RLS
alter table public.spaces enable row level security;

-- All authenticated users can read spaces
create policy "Authenticated users can read spaces"
  on public.spaces for select
  to authenticated
  using (true);
```

- [ ] **Step 5: Create sessions table migration**

Create `lib/supabase/migrations/003_create_sessions.sql`:

```sql
-- Create sessions table
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  space_id uuid references public.spaces(id) not null,
  project_name text not null default '',
  mood text check (mood in ('focused', 'calm', 'anxious', 'restless')),
  duration_minutes integer not null default 0,
  todos_completed integer not null default 0,
  started_at timestamptz not null,
  ended_at timestamptz not null
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Users can only read their own sessions
create policy "Users can read own sessions"
  on public.sessions for select
  using (
    user_id in (
      select id from public.users where google_id = auth.uid()::text
    )
  );

-- Users can only insert their own sessions
create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (
    user_id in (
      select id from public.users where google_id = auth.uid()::text
    )
  );

-- Create index for stats queries
create index sessions_user_id_idx on public.sessions(user_id);
create index sessions_started_at_idx on public.sessions(started_at);
```

- [ ] **Step 6: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add Supabase client utils and schema migrations"
```

---

### Task 7: Space Seed Data

**Files:**
- Create: `lib/supabase/seed.sql`

- [ ] **Step 1: Create seed data SQL**

Create `lib/supabase/seed.sql`:

```sql
-- Seed spaces with curated palettes and default sound configs
insert into public.spaces (id, name, category, wallpaper_path, palette_json, default_sounds_json, companion_theme) values
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Rainy Library',
  'cozy',
  '/wallpapers/rainy-library.jpg',
  '{"bg_primary":"#14130e","bg_secondary":"#1e1c16","accent":"#d4943a","accent_hover":"#e8a32e","text_primary":"#e8e0d0","text_secondary":"#8a7a5e","border":"#3a3428","surface":"#2a2620"}',
  '[{"track_id":"rain","volume":0.6,"enabled":true},{"track_id":"fire","volume":0.3,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Ocean Cabin',
  'nature',
  '/wallpapers/ocean-cabin.jpg',
  '{"bg_primary":"#0e1419","bg_secondary":"#141d24","accent":"#4a9bb5","accent_hover":"#5eb8d4","text_primary":"#d4e4ec","text_secondary":"#6a8a9e","border":"#243440","surface":"#1a2830"}',
  '[{"track_id":"waves","volume":0.7,"enabled":true},{"track_id":"forest","volume":0.2,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Mountain Lodge',
  'cozy',
  '/wallpapers/mountain-lodge.jpg',
  '{"bg_primary":"#16130f","bg_secondary":"#201c16","accent":"#c27a3a","accent_hover":"#d98f4e","text_primary":"#e8ddd0","text_secondary":"#8a755e","border":"#3a3020","surface":"#2a2418"}',
  '[{"track_id":"fire","volume":0.6,"enabled":true},{"track_id":"rain","volume":0.2,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Zen Garden',
  'nature',
  '/wallpapers/zen-garden.jpg',
  '{"bg_primary":"#0e1410","bg_secondary":"#141e16","accent":"#5a9b6b","accent_hover":"#6bb87e","text_primary":"#d4e8da","text_secondary":"#6a9a7a","border":"#243a2a","surface":"#1a2e20"}',
  '[{"track_id":"forest","volume":0.5,"enabled":true},{"track_id":"delta","volume":0.3,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'Sunset Desert',
  'ambient',
  '/wallpapers/sunset-desert.jpg',
  '{"bg_primary":"#181210","bg_secondary":"#221a16","accent":"#d46a3a","accent_hover":"#e87e4e","text_primary":"#e8dcd4","text_secondary":"#9a7a6a","border":"#3a2a22","surface":"#2e2018"}',
  '[{"track_id":"fire","volume":0.5,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0006-4000-8000-000000000006',
  'Midnight City',
  'urban',
  '/wallpapers/midnight-city.jpg',
  '{"bg_primary":"#0e0e14","bg_secondary":"#14141e","accent":"#7a6ad4","accent_hover":"#9488e8","text_primary":"#d8d4e8","text_secondary":"#7a7a9a","border":"#2a2a3a","surface":"#1e1e2e"}',
  '[{"track_id":"cafe","volume":0.5,"enabled":true},{"track_id":"rain","volume":0.3,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0007-4000-8000-000000000007',
  'Autumn Cafe',
  'cozy',
  '/wallpapers/autumn-cafe.jpg',
  '{"bg_primary":"#16120e","bg_secondary":"#201a14","accent":"#c4843a","accent_hover":"#d8984e","text_primary":"#e8dece","text_secondary":"#8a7a60","border":"#3a3020","surface":"#2a2418"}',
  '[{"track_id":"cafe","volume":0.6,"enabled":true},{"track_id":"rain","volume":0.4,"enabled":true}]',
  'default'
),
(
  'a1b2c3d4-0008-4000-8000-000000000008',
  'Northern Cabin',
  'cozy',
  '/wallpapers/northern-cabin.jpg',
  '{"bg_primary":"#101416","bg_secondary":"#161e22","accent":"#5a8aaa","accent_hover":"#6ea0c0","text_primary":"#d4dee8","text_secondary":"#6a8090","border":"#243038","surface":"#1a2830"}',
  '[{"track_id":"fire","volume":0.5,"enabled":true},{"track_id":"waves","volume":0.3,"enabled":true}]',
  'default'
);
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase/seed.sql
git commit -m "feat: add space seed data with 8 curated palettes and sound presets"
```

---

### Task 8: Environment Config

**Files:**
- Create: `.env.local.example`

- [ ] **Step 1: Create environment template**

Create `.env.local.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

- [ ] **Step 2: Ensure .env.local is in .gitignore**

Verify `.gitignore` contains `.env.local` (should be there from create-next-app). If not, add it.

- [ ] **Step 3: Commit**

```bash
git add .env.local.example
git commit -m "chore: add environment variable template"
```

---

### Task 9: Folder Structure + Prettier Config

**Files:**
- Create all empty directories and placeholder files
- Create: `.prettierrc`

- [ ] **Step 1: Create Prettier config**

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p components/{layout,timer,notes,todos,sounds,companion,spaces,mood,session,stats,ui}
mkdir -p lib/{auth,sounds}
mkdir -p store/slices
mkdir -p hooks
mkdir -p public/{wallpapers,sounds,companion}
```

- [ ] **Step 3: Create placeholder barrel files**

Create `store/slices/.gitkeep`:
```
```

Create `hooks/.gitkeep`:
```
```

Create `lib/auth/.gitkeep`:
```
```

Create `lib/sounds/.gitkeep`:
```
```

- [ ] **Step 4: Verify build still passes**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/ store/ hooks/ lib/ public/ .prettierrc
git commit -m "chore: scaffold folder structure and configure Prettier"
```

---

### Stage 1 Exit Criteria Checklist

- [ ] `npm run dev` shows themed page with olive background + amber heading
- [ ] `npm run build` succeeds with no errors
- [ ] Chakra theme tokens render correct colors
- [ ] CSS custom properties for space palettes are defined in `:root`
- [ ] Supabase migration SQL files are ready to deploy
- [ ] Seed data covers 8 spaces with unique palettes
- [ ] `.env.local.example` documents all required keys
- [ ] All directories from the file structure map exist

**Human checkpoint:** Review the theme visually. Does the olive/amber palette match your vision? Does the dev server run cleanly?

---

## Stage 2: Core Experience (Week 2-3)

> Three parallel workstreams. Each gets its own detailed plan before execution.
> **Agent pipeline per workstream:** tech-lead-frontend (plan) → staff-frontend-engineer (build) → tech-lead-frontend (review)

### Workstream 2A: Layout Shell + Spaces

**Files to create:**
- `components/layout/WorkspaceLayout.tsx` — CSS Grid 3-column wrapper
- `components/layout/NavBar.tsx` — Left icon nav (timer, wallpaper, notes icons, settings, avatar)
- `components/layout/RightPanel.tsx` — Right sidebar container
- `components/spaces/SpaceBackground.tsx` — Full-bleed wallpaper with dark overlay gradient
- `components/spaces/SpaceCard.tsx` — Thumbnail card for space selection
- `components/spaces/SpaceGrid.tsx` — Grid of SpaceCards in right panel
- `app/(dashboard)/page.tsx` — Main workspace page composing all layout components
- `app/api/spaces/route.ts` — GET endpoint returning space catalog from Supabase
- `public/wallpapers/*.jpg` — 8 curated dark/cozy wallpaper images

**Key behaviors:**
- 3-column grid: `64px | 1fr | 320px`
- NavBar: vertical icon buttons, settings gear at bottom, avatar circle at very bottom
- SpaceBackground: `position: fixed`, `z-index: -1`, wallpaper with `linear-gradient(rgba(0,0,0,0.5))` overlay
- Space switching: click SpaceCard → update `spaceSlice.activeSpaceId` → wallpaper crossfade via Framer Motion `AnimatePresence` → `applyPalette()` updates CSS variables
- Space cards show wallpaper thumbnail, name, active indicator (green dot)

**Tests:**
- SpaceBackground renders wallpaper image for active space
- SpaceGrid renders all spaces from catalog
- Space switch updates CSS custom properties
- NavBar renders all icon buttons

---

### Workstream 2B: Timer + Notes + Todos

**Files to create:**
- `hooks/useTimer.ts` — Pomodoro timer logic (useRef interval, state machine)
- `components/timer/PomodoroRing.tsx` — SVG circle with stroke-dashoffset progress
- `components/timer/TimerDisplay.tsx` — Minutes:seconds + "FOCUS"/"BREAK" label
- `components/timer/TimerControls.tsx` — Reset, play/pause, skip buttons
- `components/mood/MoodPicker.tsx` — Horizontal pill buttons for mood selection
- `components/notes/NotesPanel.tsx` — Textarea with debounced save
- `components/todos/TodoList.tsx` — List with dnd-kit sortable
- `components/todos/TodoItem.tsx` — Single row: checkbox + text + delete
- `components/session/ProjectNameInput.tsx` — Text input for naming the session

**Key behaviors:**
- `useTimer`: `setInterval` via `useRef`, decrements `timeRemaining` each second, handles idle→running→paused→break state transitions, auto-switches to break when work timer hits 0
- PomodoroRing: SVG circle, `stroke-dasharray` = circumference, `stroke-dashoffset` = circumference × (1 - progress), amber stroke color
- MoodPicker: selecting mood updates `sessionSlice.mood` and resets timer durations per `MOOD_CONFIGS`
- NotesPanel: `onChange` triggers debounced (500ms) save to `notesSlice.notesContent`
- TodoList: dnd-kit `SortableContext`, reorder updates `todosSlice.todos` order values
- TodoItem: checkbox toggles `completed`, strikethrough text style, delete button on hover

**Tests:**
- useTimer: starts, pauses, resets, transitions to break
- PomodoroRing: renders correct progress at 50%, 0%, 100%
- MoodPicker: selecting mood updates store with correct durations
- TodoList: add, complete, delete, reorder operations
- NotesPanel: debounced save fires after 500ms

---

### Workstream 2C: Zustand Store + Persistence

**Files to create:**
- `store/slices/timerSlice.ts` — Timer state, actions (start, pause, reset, tick, switchToBreak)
- `store/slices/spaceSlice.ts` — activeSpaceId, spaces array, setActiveSpace
- `store/slices/notesSlice.ts` — notesContent, setNotes
- `store/slices/todosSlice.ts` — todos array, addTodo, toggleTodo, deleteTodo, reorderTodos
- `store/slices/soundSlice.ts` — soundTracks array, setTrackVolume, toggleTrack
- `store/slices/companionSlice.ts` — companionState, setCompanionState
- `store/slices/sessionSlice.ts` — mood, projectName, sessionStartedAt, setMood, setProjectName, startSession, endSession
- `store/index.ts` — Combined store with `persist` middleware and `idb-keyval` storage
- `hooks/useHydration.ts` — Hydration guard hook

**Key behaviors:**
- Each slice is a function `(set, get) => ({ ...state, ...actions })`
- Combined with Zustand `persist` middleware: `persist((...a) => ({ ...timerSlice(...a), ...spaceSlice(...a), ... }), { name: 'destract-store', storage: createJSONStorage(() => idbStorage) })`
- Custom `idbStorage` adapter using `idb-keyval`'s `get`/`set`/`del`
- `useHydration` returns `hasHydrated` boolean — components render loading skeleton until `true`
- Only persist non-ephemeral state (exclude `timerStatus`, `timeRemaining` from persistence — these reset on reload)

**Tests:**
- Each slice: initial state, each action produces correct state
- Persistence: store round-trips through idb-keyval mock
- Hydration: `hasHydrated` starts false, becomes true after store rehydrates

---

### Stage 2 Merge Integration

After all three workstreams are reviewed and approved:
1. Merge workstream C (store) first — no UI dependencies
2. Merge workstream B (timer/notes/todos) — connect components to store
3. Merge workstream A (layout/spaces) — wire everything into 3-column layout
4. Integration test: full layout with live timer, notes, todos, space switching

---

## Stage 3: Enrichment (Week 3-4)

> Three parallel workstreams. Each gets its own detailed plan before execution.

### Workstream 3A: Auth + Protected Routes

**Files to create:**
- `lib/auth/config.ts` — NextAuth.js v5 config with Google provider
- `app/api/auth/[...nextauth]/route.ts` — Auth API route
- `middleware.ts` — Protect `/(dashboard)` routes
- `app/page.tsx` — Landing page (replaces test page from Stage 1)
- `app/(auth)/login/page.tsx` — Login page with Google sign-in
- `app/(dashboard)/layout.tsx` — Auth-gated layout with session check

**Key behaviors:**
- NextAuth Google provider with Supabase adapter (upsert user on first login)
- Middleware checks session, redirects unauthenticated to `/login`
- Landing page: hero section with tagline, app screenshot, Google sign-in CTA
- Dashboard layout: wraps all protected pages, passes session to children
- NavBar avatar: shows Google profile image, links to sign out

---

### Workstream 3B: Ambient Sound System

**Files to create:**
- `hooks/useAudio.ts` — Howler.js wrapper for multi-track management
- `lib/sounds/tracks.ts` — Track metadata (id, name, icon, file path)
- `lib/sounds/presets.ts` — Mood-to-sound preset mapping
- `components/sounds/SoundMixer.tsx` — Panel with all sound rows
- `components/sounds/SoundSlider.tsx` — Single track: icon + name + slider + active dot
- `public/sounds/*.mp3` — 6 free-license ambient loops

**Key behaviors:**
- `useAudio`: creates one `Howl` instance per track, manages play/pause/volume per track, handles browser autoplay (require user gesture), crossfades volumes on space switch
- SoundMixer: maps `soundSlice.soundTracks` to SoundSlider rows
- SoundSlider: dragging slider updates `soundSlice` track volume, clicking dot toggles enabled
- Space switch: reads new space's `default_sounds_json`, applies as new sound config (unless user has manually overridden)

**Audio files to source (free-license, seamless loop, .mp3, 2-4MB each):**
- `rain.mp3` — Steady rain
- `waves.mp3` — Ocean waves
- `cafe.mp3` — Coffee shop ambience
- `fire.mp3` — Crackling fireplace
- `forest.mp3` — Forest birds + wind
- `delta.mp3` — Delta/theta binaural beats

---

### Workstream 3C: Companion Bear

**Files to create:**
- `components/companion/CompanionBear.tsx` — State-switching container
- `components/companion/BearWorking.tsx` — SVG placeholder: bear at desk
- `components/companion/BearCelebrating.tsx` — SVG placeholder: happy bear
- `components/companion/BearIdle.tsx` — SVG placeholder: drowsy bear
- `components/companion/BearStretching.tsx` — SVG placeholder: relaxed bear
- `components/companion/SpeechBubble.tsx` — Status text bubble
- `hooks/useIdle.ts` — Idle detection hook

**Key behaviors:**
- CompanionBear reads `companionSlice.companionState`, renders matching SVG with CSS opacity transition
- State machine: timer running → working, pomodoro complete → celebrating (3s timeout) → stretching, break → stretching, 5min idle → yawning/idle
- `useIdle`: listens to `mousemove`, `keydown`, `click`, `scroll` — resets 5min timer on any event, fires callback on timeout
- SpeechBubble: maps state to text ("working hard", "nice job!", "stretch break", "still there?")
- SVGs are simple, warm-toned placeholders designed to be swapped for Lottie later
- Component accepts `animationSource: 'svg' | 'lottie'` prop for future flexibility

---

### Stage 3 Merge Integration

1. Merge workstream A (auth) first — wraps entire app in session
2. Merge workstream B (sounds) — connect to store + space switching
3. Merge workstream C (companion) — connect to timer state
4. Integration test: sign in → workspace with sounds + companion reacting to timer

---

## Stage 4: Integration & Polish (Week 5-6)

> More sequential. Detailed plan written before execution.

### 4A: Session Saving

**Files to create:**
- `app/api/sessions/route.ts` — POST with Zod validation
- `app/api/sessions/stats/route.ts` — GET with aggregation queries
- `components/session/SessionSummary.tsx` — Celebration card (Framer Motion)
- `components/session/QuickStart.tsx` — "I need 5 minutes" button

### 4B: Stats Dashboard

**Files to create:**
- `app/(dashboard)/stats/page.tsx` — Stats page
- `components/stats/WeeklyChart.tsx` — Bar chart (custom SVG)
- `components/stats/StreakCalendar.tsx` — Heatmap calendar
- `components/stats/TopProjects.tsx` — Ranked project list

### 4C: Framer Motion Polish

**Files to modify:** All component files — add `motion` wrappers, `AnimatePresence` for transitions, `useReducedMotion` checks.

### 4D: Mobile Responsiveness

**Files to modify:** `WorkspaceLayout.tsx`, `NavBar.tsx`, `RightPanel.tsx` — add breakpoint-responsive grid, bottom nav for mobile, drawer for right panel.

### 4E: Accessibility + Final Polish

**Files to modify:** All interactive components — add ARIA attributes, keyboard handlers, focus management. Create `CLAUDE.md` with project conventions.

---

## Execution Order Summary

```
Stage 1 ──sequential──────────────────────────────► Checkpoint 1
  [Foundation: theme, schema, types, scaffold]

Stage 2 ──three parallel workstreams──────────────► Checkpoint 2
  [2A: Layout + Spaces] ──┐
  [2B: Timer + Notes]  ───┼──► Merge + integrate
  [2C: Zustand Store]  ───┘

Stage 3 ──three parallel workstreams──────────────► Checkpoint 3
  [3A: Auth]       ──┐
  [3B: Sounds]     ──┼──► Merge + integrate
  [3C: Companion]  ──┘

Stage 4 ──two parallel tracks + final pass────────► Checkpoint 4
  [4A+4B: Sessions + Stats] ──┐
  [4C+4D: Polish + Mobile]  ──┼──► 4E: Accessibility ──► Ship
```
