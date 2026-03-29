# Stage 2: Core Experience — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full 3-column focus workspace with working Pomodoro timer, notes, todos, space switching, and persisted state.

**Architecture:** Three workstreams executed sequentially: Store (2C) → Components (2B) → Layout (2A) → Integration. Store-first so components can bind directly to Zustand.

**Tech Stack:** Chakra UI v3, Zustand + idb-keyval, Framer Motion, dnd-kit, Next.js 16 App Router

**Spec:** `docs/superpowers/specs/2026-03-29-destract-v1-design.md`

**Design tokens reference:** `theme/index.ts` — semantic tokens: `bg`, `bg.panel`, `bg.surface`, `bg.elevated`, `fg`, `fg.secondary`, `fg.muted`, `accent`, `accent.dim`, `accent.soft`, `border`, `border.mid`, `border.strong`, `success`

---

## Workstream 2C: Zustand Store + Persistence

---

### Task 1: Timer Slice

**Files:**

- Create: `store/slices/timerSlice.ts`

- [ ] **Step 1: Create timer slice**

```typescript
// store/slices/timerSlice.ts
import { StateCreator } from "zustand";

export interface TimerSlice {
  timerStatus: "idle" | "running" | "paused" | "break";
  timeRemaining: number;
  workDuration: number;
  breakDuration: number;
  currentRound: number;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchToBreak: () => void;
  switchToWork: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (set, get) => ({
  timerStatus: "idle",
  timeRemaining: 25 * 60,
  workDuration: 25,
  breakDuration: 5,
  currentRound: 1,

  startTimer: () => set({ timerStatus: "running" }),

  pauseTimer: () => set({ timerStatus: "paused" }),

  resetTimer: () =>
    set((state) => ({
      timerStatus: "idle",
      timeRemaining: state.workDuration * 60,
      currentRound: 1,
    })),

  tick: () => {
    const { timeRemaining, timerStatus } = get();
    if (timerStatus !== "running" && timerStatus !== "break") return;
    if (timeRemaining <= 1) {
      if (timerStatus === "running") {
        get().switchToBreak();
      } else {
        get().switchToWork();
      }
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },

  switchToBreak: () =>
    set((state) => ({
      timerStatus: "break",
      timeRemaining: state.breakDuration * 60,
    })),

  switchToWork: () =>
    set((state) => ({
      timerStatus: "idle",
      timeRemaining: state.workDuration * 60,
      currentRound: state.currentRound + 1,
    })),

  setWorkDuration: (minutes) =>
    set((state) => ({
      workDuration: minutes,
      timeRemaining: state.timerStatus === "idle" ? minutes * 60 : state.timeRemaining,
    })),

  setBreakDuration: (minutes) => set({ breakDuration: minutes }),
});
```

- [ ] **Step 2: Commit**

```bash
git add store/slices/timerSlice.ts
git commit -m "feat: add timer Zustand slice with start/pause/reset/tick actions"
```

---

### Task 2: Space, Notes, Todos, Sound, Companion, Session Slices

**Files:**

- Create: `store/slices/spaceSlice.ts`
- Create: `store/slices/notesSlice.ts`
- Create: `store/slices/todosSlice.ts`
- Create: `store/slices/soundSlice.ts`
- Create: `store/slices/companionSlice.ts`
- Create: `store/slices/sessionSlice.ts`

- [ ] **Step 1: Create space slice**

```typescript
// store/slices/spaceSlice.ts
import { StateCreator } from "zustand";

export interface SpaceSlice {
  activeSpaceId: string;
  setActiveSpace: (id: string) => void;
}

export const createSpaceSlice: StateCreator<SpaceSlice, [], [], SpaceSlice> = (set) => ({
  activeSpaceId: "a1b2c3d4-0001-4000-8000-000000000001",
  setActiveSpace: (id) => set({ activeSpaceId: id }),
});
```

- [ ] **Step 2: Create notes slice**

```typescript
// store/slices/notesSlice.ts
import { StateCreator } from "zustand";

export interface NotesSlice {
  notesContent: string;
  setNotes: (content: string) => void;
}

export const createNotesSlice: StateCreator<NotesSlice, [], [], NotesSlice> = (set) => ({
  notesContent: "",
  setNotes: (content) => set({ notesContent: content }),
});
```

- [ ] **Step 3: Create todos slice**

```typescript
// store/slices/todosSlice.ts
import { StateCreator } from "zustand";
import { Todo } from "@/types";

export interface TodosSlice {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (todos: Todo[]) => void;
}

export const createTodosSlice: StateCreator<TodosSlice, [], [], TodosSlice> = (set) => ({
  todos: [],

  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: crypto.randomUUID(),
          text,
          completed: false,
          order: state.todos.length,
        },
      ],
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),

  reorderTodos: (todos) => set({ todos }),
});
```

- [ ] **Step 4: Create sound slice**

```typescript
// store/slices/soundSlice.ts
import { StateCreator } from "zustand";
import { SoundTrack } from "@/types";

export interface SoundSlice {
  soundTracks: SoundTrack[];
  setTrackVolume: (id: string, volume: number) => void;
  toggleTrack: (id: string) => void;
  setSoundTracks: (tracks: SoundTrack[]) => void;
}

const defaultTracks: SoundTrack[] = [
  {
    id: "rain",
    name: "Rain",
    icon: "\uD83C\uDF27\uFE0F",
    file: "/sounds/rain.mp3",
    volume: 0,
    enabled: false,
  },
  {
    id: "waves",
    name: "Waves",
    icon: "\uD83C\uDF0A",
    file: "/sounds/waves.mp3",
    volume: 0,
    enabled: false,
  },
  { id: "cafe", name: "Cafe", icon: "\u2615", file: "/sounds/cafe.mp3", volume: 0, enabled: false },
  {
    id: "fire",
    name: "Fire",
    icon: "\uD83D\uDD25",
    file: "/sounds/fire.mp3",
    volume: 0,
    enabled: false,
  },
  {
    id: "forest",
    name: "Forest",
    icon: "\uD83C\uDF3F",
    file: "/sounds/forest.mp3",
    volume: 0,
    enabled: false,
  },
  {
    id: "delta",
    name: "Delta",
    icon: "\uD83E\uDDE0",
    file: "/sounds/delta.mp3",
    volume: 0,
    enabled: false,
  },
];

export const createSoundSlice: StateCreator<SoundSlice, [], [], SoundSlice> = (set) => ({
  soundTracks: defaultTracks,

  setTrackVolume: (id, volume) =>
    set((state) => ({
      soundTracks: state.soundTracks.map((t) =>
        t.id === id ? { ...t, volume, enabled: volume > 0 } : t,
      ),
    })),

  toggleTrack: (id) =>
    set((state) => ({
      soundTracks: state.soundTracks.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    })),

  setSoundTracks: (tracks) => set({ soundTracks: tracks }),
});
```

- [ ] **Step 5: Create companion slice**

```typescript
// store/slices/companionSlice.ts
import { StateCreator } from "zustand";
import { CompanionState } from "@/types";

export interface CompanionSlice {
  companionState: CompanionState;
  setCompanionState: (state: CompanionState) => void;
}

export const createCompanionSlice: StateCreator<CompanionSlice, [], [], CompanionSlice> = (
  set,
) => ({
  companionState: "idle",
  setCompanionState: (companionState) => set({ companionState }),
});
```

- [ ] **Step 6: Create session slice**

```typescript
// store/slices/sessionSlice.ts
import { StateCreator } from "zustand";
import { Mood } from "@/types";

export interface SessionSlice {
  mood: Mood | null;
  projectName: string;
  sessionStartedAt: number | null;
  setMood: (mood: Mood | null) => void;
  setProjectName: (name: string) => void;
  startSession: () => void;
  endSession: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  mood: null,
  projectName: "",
  sessionStartedAt: null,

  setMood: (mood) => set({ mood }),
  setProjectName: (name) => set({ projectName: name }),
  startSession: () => set({ sessionStartedAt: Date.now() }),
  endSession: () => set({ sessionStartedAt: null }),
});
```

- [ ] **Step 7: Commit**

```bash
git add store/slices/
git commit -m "feat: add space, notes, todos, sound, companion, session Zustand slices"
```

---

### Task 3: Combined Store with IndexedDB Persistence

**Files:**

- Create: `store/index.ts`
- Create: `hooks/useHydration.ts`

- [ ] **Step 1: Create combined store with persistence**

```typescript
// store/index.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";
import { createTimerSlice, TimerSlice } from "./slices/timerSlice";
import { createSpaceSlice, SpaceSlice } from "./slices/spaceSlice";
import { createNotesSlice, NotesSlice } from "./slices/notesSlice";
import { createTodosSlice, TodosSlice } from "./slices/todosSlice";
import { createSoundSlice, SoundSlice } from "./slices/soundSlice";
import { createCompanionSlice, CompanionSlice } from "./slices/companionSlice";
import { createSessionSlice, SessionSlice } from "./slices/sessionSlice";

export type AppStore = TimerSlice &
  SpaceSlice &
  NotesSlice &
  TodosSlice &
  SoundSlice &
  CompanionSlice &
  SessionSlice;

const idbStorage = {
  getItem: async (name: string) => {
    const value = await idbGet(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await idbSet(name, value);
  },
  removeItem: async (name: string) => {
    await idbDel(name);
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createTimerSlice(...a),
      ...createSpaceSlice(...a),
      ...createNotesSlice(...a),
      ...createTodosSlice(...a),
      ...createSoundSlice(...a),
      ...createCompanionSlice(...a),
      ...createSessionSlice(...a),
    }),
    {
      name: "focusden-store",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        // Persist user data, not ephemeral timer state
        activeSpaceId: state.activeSpaceId,
        notesContent: state.notesContent,
        todos: state.todos,
        soundTracks: state.soundTracks,
        mood: state.mood,
        projectName: state.projectName,
        workDuration: state.workDuration,
        breakDuration: state.breakDuration,
      }),
    },
  ),
);
```

- [ ] **Step 2: Create hydration hook**

```typescript
// hooks/useHydration.ts
"use client";

import { useEffect, useState } from "react";

export function useHydration(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // If already hydrated (e.g., SSR or fast load)
    if (useAppStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hasHydrated;
}

// Import here to avoid circular dependency issues
import { useAppStore } from "@/store";
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add store/index.ts hooks/useHydration.ts
git commit -m "feat: create combined Zustand store with IndexedDB persistence and hydration hook"
```

---

## Workstream 2B: Timer + Notes + Todos

---

### Task 4: useTimer Hook

**Files:**

- Create: `hooks/useTimer.ts`

- [ ] **Step 1: Create timer hook**

```typescript
// hooks/useTimer.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store";

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStatus = useAppStore((s) => s.timerStatus);
  const timeRemaining = useAppStore((s) => s.timeRemaining);
  const workDuration = useAppStore((s) => s.workDuration);
  const breakDuration = useAppStore((s) => s.breakDuration);
  const currentRound = useAppStore((s) => s.currentRound);
  const tick = useAppStore((s) => s.tick);
  const startTimer = useAppStore((s) => s.startTimer);
  const pauseTimer = useAppStore((s) => s.pauseTimer);
  const resetTimer = useAppStore((s) => s.resetTimer);

  useEffect(() => {
    if (timerStatus === "running" || timerStatus === "break") {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerStatus, tick]);

  const toggleTimer = useCallback(() => {
    if (timerStatus === "running" || timerStatus === "break") {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [timerStatus, startTimer, pauseTimer]);

  const skipToNext = useCallback(() => {
    if (timerStatus === "running" || timerStatus === "paused") {
      useAppStore.getState().switchToBreak();
    } else if (timerStatus === "break") {
      useAppStore.getState().switchToWork();
    }
  }, [timerStatus]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress =
    timerStatus === "break"
      ? 1 - timeRemaining / (breakDuration * 60)
      : 1 - timeRemaining / (workDuration * 60);

  return {
    timerStatus,
    timeRemaining,
    minutes,
    seconds,
    progress,
    currentRound,
    workDuration,
    breakDuration,
    isRunning: timerStatus === "running" || timerStatus === "break",
    toggleTimer,
    resetTimer,
    skipToNext,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add hooks/useTimer.ts
git commit -m "feat: add useTimer hook with interval management and progress calculation"
```

---

### Task 5: Pomodoro Timer Components

**Files:**

- Create: `components/timer/PomodoroRing.tsx`
- Create: `components/timer/TimerDisplay.tsx`
- Create: `components/timer/TimerControls.tsx`

- [ ] **Step 1: Create SVG ring progress**

```tsx
// components/timer/PomodoroRing.tsx
"use client";

import { Box } from "@chakra-ui/react";

interface PomodoroRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  isBreak?: boolean;
}

export function PomodoroRing({
  progress,
  size = 280,
  strokeWidth = 6,
  isBreak = false,
}: PomodoroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <Box position="relative" width={`${size}px`} height={`${size}px`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface)"
          strokeWidth={strokeWidth}
          opacity={0.5}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isBreak ? "var(--chakra-colors-sage-300)" : "var(--color-accent)"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
    </Box>
  );
}
```

- [ ] **Step 2: Create timer display**

```tsx
// components/timer/TimerDisplay.tsx
"use client";

import { Box, Text } from "@chakra-ui/react";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  label: string;
}

export function TimerDisplay({ minutes, seconds, label }: TimerDisplayProps) {
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Box textAlign="center">
      <Text
        fontSize="timer"
        fontWeight="light"
        color="fg"
        fontFamily="mono"
        letterSpacing="0.05em"
        lineHeight="1"
      >
        {timeStr}
      </Text>
      <Text
        fontSize="xs"
        fontWeight="medium"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="0.2em"
        mt="2"
      >
        {label}
      </Text>
    </Box>
  );
}
```

- [ ] **Step 3: Create timer controls**

```tsx
// components/timer/TimerControls.tsx
"use client";

import { HStack, IconButton } from "@chakra-ui/react";
import { useTimer } from "@/hooks/useTimer";

// Simple SVG icons inline to avoid icon library dependency
function ResetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,4 15,12 5,20" />
      <rect x="17" y="4" width="3" height="16" />
    </svg>
  );
}

export function TimerControls() {
  const { timerStatus, isRunning, toggleTimer, resetTimer, skipToNext } = useTimer();

  return (
    <HStack gap="4" justify="center">
      <IconButton
        aria-label="Reset timer"
        variant="ghost"
        size="icon"
        onClick={resetTimer}
        disabled={timerStatus === "idle"}
        rounded="full"
      >
        <ResetIcon />
      </IconButton>

      <IconButton
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        variant="primary"
        size="lg"
        onClick={toggleTimer}
        rounded="full"
        w="14"
        h="14"
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </IconButton>

      <IconButton
        aria-label="Skip to next"
        variant="ghost"
        size="icon"
        onClick={skipToNext}
        disabled={timerStatus === "idle"}
        rounded="full"
      >
        <SkipIcon />
      </IconButton>
    </HStack>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/timer/
git commit -m "feat: add Pomodoro timer components (ring, display, controls)"
```

---

### Task 6: Mood Picker

**Files:**

- Create: `components/mood/MoodPicker.tsx`

- [ ] **Step 1: Create mood picker**

```tsx
// components/mood/MoodPicker.tsx
"use client";

import { HStack, Text, Button } from "@chakra-ui/react";
import { useAppStore } from "@/store";
import { Mood, MOOD_CONFIGS } from "@/types";

const moods: { value: Mood; label: string }[] = [
  { value: "focused", label: "Focused" },
  { value: "calm", label: "Calm" },
  { value: "anxious", label: "Anxious" },
  { value: "restless", label: "Restless" },
];

export function MoodPicker() {
  const currentMood = useAppStore((s) => s.mood);
  const setMood = useAppStore((s) => s.setMood);
  const setWorkDuration = useAppStore((s) => s.setWorkDuration);
  const setBreakDuration = useAppStore((s) => s.setBreakDuration);

  const handleSelect = (mood: Mood) => {
    const isDeselect = currentMood === mood;
    if (isDeselect) {
      setMood(null);
      setWorkDuration(25);
      setBreakDuration(5);
      return;
    }
    setMood(mood);
    const config = MOOD_CONFIGS[mood];
    setWorkDuration(config.workMinutes);
    setBreakDuration(config.breakMinutes);
  };

  return (
    <HStack gap="3" align="center">
      <Text fontSize="sm" color="fg.muted" fontWeight="medium">
        Feeling
      </Text>
      {moods.map((m) => (
        <Button
          key={m.value}
          size="sm"
          variant={currentMood === m.value ? "primary" : "surface"}
          onClick={() => handleSelect(m.value)}
          rounded="full"
          fontSize="sm"
          px="4"
          py="1"
          h="auto"
        >
          {m.label}
        </Button>
      ))}
    </HStack>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/mood/
git commit -m "feat: add MoodPicker with mood-aware timer duration adjustment"
```

---

### Task 7: Notes Panel

**Files:**

- Create: `components/notes/NotesPanel.tsx`

- [ ] **Step 1: Create notes panel**

```tsx
// components/notes/NotesPanel.tsx
"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useRef, useCallback } from "react";
import { useAppStore } from "@/store";

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function NotesPanel() {
  const notesContent = useAppStore((s) => s.notesContent);
  const setNotes = useAppStore((s) => s.setNotes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setNotes(value);
      }, 500);
    },
    [setNotes],
  );

  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border"
      borderRadius="xl"
      p="4"
      flex="1"
      display="flex"
      flexDirection="column"
      minH="0"
    >
      <HStack justify="space-between" mb="3">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.15em"
        >
          Notes
        </Text>
        <IconButton aria-label="Add note" variant="ghost" size="sm" rounded="full">
          <PlusIcon />
        </IconButton>
      </HStack>
      <Box
        as="textarea"
        defaultValue={notesContent}
        onChange={handleChange}
        placeholder="What are you working on..."
        flex="1"
        bg="transparent"
        border="none"
        outline="none"
        color="fg.secondary"
        fontSize="md"
        resize="none"
        lineHeight="tall"
        _placeholder={{ color: "fg.dim" }}
        css={{ "&:focus": { outline: "none" } }}
      />
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/notes/
git commit -m "feat: add NotesPanel with debounced auto-save to store"
```

---

### Task 8: Todo List

**Files:**

- Create: `components/todos/TodoItem.tsx`
- Create: `components/todos/TodoList.tsx`

- [ ] **Step 1: Create TodoItem**

```tsx
// components/todos/TodoItem.tsx
"use client";

import { HStack, Text, IconButton, Box } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types";
import { useAppStore } from "@/store";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useAppStore((s) => s.toggleTodo);
  const deleteTodo = useAppStore((s) => s.deleteTodo);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      gap="3"
      py="1.5"
      role="group"
      cursor="grab"
      {...attributes}
      {...listeners}
    >
      <Box
        as="button"
        onClick={() => toggleTodo(todo.id)}
        w="5"
        h="5"
        borderRadius="md"
        border="1.5px solid"
        borderColor={todo.completed ? "success" : "border.mid"}
        bg={todo.completed ? "success.soft" : "transparent"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        color="success"
        cursor="pointer"
      >
        {todo.completed && <CheckIcon />}
      </Box>
      <Text
        flex="1"
        fontSize="sm"
        color={todo.completed ? "fg.muted" : "fg.secondary"}
        textDecoration={todo.completed ? "line-through" : "none"}
      >
        {todo.text}
      </Text>
      <IconButton
        aria-label="Delete todo"
        variant="ghost"
        size="sm"
        onClick={() => deleteTodo(todo.id)}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        color="fg.muted"
        rounded="full"
      >
        <TrashIcon />
      </IconButton>
    </HStack>
  );
}
```

- [ ] **Step 2: Create TodoList**

```tsx
// components/todos/TodoList.tsx
"use client";

import { Box, Text, HStack, IconButton, Input } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAppStore } from "@/store";
import { TodoItem } from "./TodoItem";

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function TodoList() {
  const todos = useAppStore((s) => s.todos);
  const addTodo = useAppStore((s) => s.addTodo);
  const reorderTodos = useAppStore((s) => s.reorderTodos);
  const [newTodoText, setNewTodoText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = useCallback(() => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
      setIsAdding(false);
    }
  }, [newTodoText, addTodo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAdd();
      if (e.key === "Escape") {
        setNewTodoText("");
        setIsAdding(false);
      }
    },
    [handleAdd],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      reorderTodos(arrayMove(todos, oldIndex, newIndex));
    },
    [todos, reorderTodos],
  );

  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border"
      borderRadius="xl"
      p="4"
      flex="1"
      display="flex"
      flexDirection="column"
      minH="0"
    >
      <HStack justify="space-between" mb="3">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.15em"
        >
          Todos
        </Text>
        <IconButton
          aria-label="Add todo"
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(true)}
          rounded="full"
        >
          <PlusIcon />
        </IconButton>
      </HStack>

      {isAdding && (
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="What needs doing..."
          size="sm"
          mb="2"
          autoFocus
          bg="bg.surface"
          border="1px solid"
          borderColor="border.mid"
        />
      )}

      <Box flex="1" overflow="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/todos/
git commit -m "feat: add TodoList with drag-and-drop reorder, check, and delete"
```

---

### Task 9: Project Name Input

**Files:**

- Create: `components/session/ProjectNameInput.tsx`

- [ ] **Step 1: Create project name input**

```tsx
// components/session/ProjectNameInput.tsx
"use client";

import { Input } from "@chakra-ui/react";
import { useAppStore } from "@/store";

export function ProjectNameInput() {
  const projectName = useAppStore((s) => s.projectName);
  const setProjectName = useAppStore((s) => s.setProjectName);

  return (
    <Input
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      placeholder="Project name..."
      variant="unstyled"
      fontSize="sm"
      color="fg.secondary"
      textAlign="center"
      _placeholder={{ color: "fg.dim" }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/session/
git commit -m "feat: add ProjectNameInput component"
```

---

## Workstream 2A: Layout Shell + Spaces

---

### Task 10: Layout Components

**Files:**

- Create: `components/layout/NavBar.tsx`
- Create: `components/layout/RightPanel.tsx`
- Create: `components/layout/WorkspaceLayout.tsx`

- [ ] **Step 1: Create NavBar**

```tsx
// components/layout/NavBar.tsx
"use client";

import { VStack, IconButton, Box, Spacer } from "@chakra-ui/react";

function TimerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function NavBar() {
  return (
    <VStack
      as="nav"
      h="100vh"
      w="64px"
      bg="bg.panel"
      borderRight="1px solid"
      borderColor="border"
      py="4"
      px="2"
      gap="2"
      align="center"
    >
      {/* Logo */}
      <Box mb="2">
        <Text fontSize="xl" fontFamily="heading" color="accent" fontWeight="semibold">
          F
        </Text>
      </Box>

      <IconButton aria-label="Timer" variant="ghost" size="icon" rounded="lg">
        <TimerIcon />
      </IconButton>
      <IconButton aria-label="Spaces" variant="ghost" size="icon" rounded="lg">
        <ImageIcon />
      </IconButton>
      <IconButton aria-label="Notes" variant="ghost" size="icon" rounded="lg">
        <NoteIcon />
      </IconButton>

      <Spacer />

      <IconButton aria-label="Settings" variant="ghost" size="icon" rounded="lg">
        <SettingsIcon />
      </IconButton>

      {/* Avatar placeholder */}
      <Box
        w="36px"
        h="36px"
        borderRadius="full"
        border="2px solid"
        borderColor="accent"
        bg="accent.soft"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xs" fontWeight="semibold" color="accent">
          YO
        </Text>
      </Box>
    </VStack>
  );
}

import { Text } from "@chakra-ui/react";
```

Wait — there is a bug in the above. The `Text` import is at the bottom instead of in the main import. Let me fix that in the actual file. The agent should place `Text` in the main import from `@chakra-ui/react`.

- [ ] **Step 2: Create RightPanel**

```tsx
// components/layout/RightPanel.tsx
"use client";

import { VStack, Box, Text } from "@chakra-ui/react";

interface RightPanelProps {
  children?: React.ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <VStack
      as="aside"
      h="100vh"
      w="320px"
      bg="bg.panel"
      borderLeft="1px solid"
      borderColor="border"
      py="4"
      px="4"
      gap="4"
      overflow="auto"
      css={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      {children}
    </VStack>
  );
}
```

- [ ] **Step 3: Create WorkspaceLayout**

```tsx
// components/layout/WorkspaceLayout.tsx
"use client";

import { Grid } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import { RightPanel } from "./RightPanel";

interface WorkspaceLayoutProps {
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
}

export function WorkspaceLayout({ rightPanel, children }: WorkspaceLayoutProps) {
  return (
    <Grid templateColumns="64px 1fr 320px" h="100vh" overflow="hidden">
      <NavBar />
      <main style={{ position: "relative", overflow: "hidden" }}>{children}</main>
      <RightPanel>{rightPanel}</RightPanel>
    </Grid>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/
git commit -m "feat: add 3-column layout components (NavBar, RightPanel, WorkspaceLayout)"
```

---

### Task 11: Space Components

**Files:**

- Create: `components/spaces/SpaceBackground.tsx`
- Create: `components/spaces/SpaceCard.tsx`
- Create: `components/spaces/SpaceGrid.tsx`
- Create: `lib/supabase/spaces.ts`

- [ ] **Step 1: Create spaces data helper**

Since we don't have Supabase connected yet, create a local data file that mirrors seed data for client-side use:

```typescript
// lib/supabase/spaces.ts
import { Space } from "@/types";
import { spacePalettes } from "@/theme/palettes";

export const SPACES: Space[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Rainy Library",
    category: "cozy",
    wallpaper_path: "/wallpapers/rainy-library.jpg",
    palette: spacePalettes["rainy-library"],
    default_sounds: [
      { track_id: "rain", volume: 0.6, enabled: true },
      { track_id: "fire", volume: 0.3, enabled: true },
    ],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "Ocean Cabin",
    category: "nature",
    wallpaper_path: "/wallpapers/ocean-cabin.jpg",
    palette: spacePalettes["ocean-cabin"],
    default_sounds: [
      { track_id: "waves", volume: 0.7, enabled: true },
      { track_id: "forest", volume: 0.2, enabled: true },
    ],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    name: "Mountain Lodge",
    category: "cozy",
    wallpaper_path: "/wallpapers/mountain-lodge.jpg",
    palette: spacePalettes["mountain-lodge"],
    default_sounds: [
      { track_id: "fire", volume: 0.6, enabled: true },
      { track_id: "rain", volume: 0.2, enabled: true },
    ],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    name: "Zen Garden",
    category: "nature",
    wallpaper_path: "/wallpapers/zen-garden.jpg",
    palette: spacePalettes["zen-garden"],
    default_sounds: [
      { track_id: "forest", volume: 0.5, enabled: true },
      { track_id: "delta", volume: 0.3, enabled: true },
    ],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    name: "Sunset Desert",
    category: "ambient",
    wallpaper_path: "/wallpapers/sunset-desert.jpg",
    palette: spacePalettes["sunset-desert"],
    default_sounds: [{ track_id: "fire", volume: 0.5, enabled: true }],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0006-4000-8000-000000000006",
    name: "Midnight City",
    category: "urban",
    wallpaper_path: "/wallpapers/midnight-city.jpg",
    palette: spacePalettes["midnight-city"],
    default_sounds: [
      { track_id: "cafe", volume: 0.5, enabled: true },
      { track_id: "rain", volume: 0.3, enabled: true },
    ],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0007-4000-8000-000000000007",
    name: "Autumn Cafe",
    category: "cozy",
    wallpaper_path: "/wallpapers/autumn-cafe.jpg",
    palette: spacePalettes["autumn-cafe"],
    default_sounds: [
      { track_id: "cafe", volume: 0.6, enabled: true },
      { track_id: "rain", volume: 0.4, enabled: true },
    ],
    companion_theme: "default",
  },
  {
    id: "a1b2c3d4-0008-4000-8000-000000000008",
    name: "Northern Cabin",
    category: "cozy",
    wallpaper_path: "/wallpapers/northern-cabin.jpg",
    palette: spacePalettes["northern-cabin"],
    default_sounds: [
      { track_id: "fire", volume: 0.5, enabled: true },
      { track_id: "waves", volume: 0.3, enabled: true },
    ],
    companion_theme: "default",
  },
];

export function getSpaceById(id: string): Space | undefined {
  return SPACES.find((s) => s.id === id);
}
```

- [ ] **Step 2: Create SpaceBackground**

```tsx
// components/spaces/SpaceBackground.tsx
"use client";

import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import { getSpaceById } from "@/lib/supabase/spaces";
import { applyPalette, defaultPalette } from "@/theme/palettes";

export function SpaceBackground() {
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const space = getSpaceById(activeSpaceId);
  const wallpaper = space?.wallpaper_path ?? "/wallpapers/rainy-library.jpg";

  useEffect(() => {
    applyPalette(space?.palette ?? defaultPalette);
  }, [space]);

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={-1}
      backgroundImage={`url(${wallpaper})`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {/* Dark overlay for readability */}
      <Box position="absolute" inset="0" bg="blackAlpha.700" />
    </Box>
  );
}
```

- [ ] **Step 3: Create SpaceCard**

```tsx
// components/spaces/SpaceCard.tsx
"use client";

import { Box, Text } from "@chakra-ui/react";
import { Space } from "@/types";
import { useAppStore } from "@/store";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const setActiveSpace = useAppStore((s) => s.setActiveSpace);
  const isActive = activeSpaceId === space.id;

  return (
    <Box
      as="button"
      onClick={() => setActiveSpace(space.id)}
      w="full"
      h="60px"
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      border="2px solid"
      borderColor={isActive ? "accent" : "transparent"}
      transition="all 0.2s"
      _hover={{ borderColor: isActive ? "accent" : "border.mid" }}
      cursor="pointer"
    >
      {/* Thumbnail background with space palette color */}
      <Box
        position="absolute"
        inset="0"
        bg={space.palette.bg_primary}
        backgroundImage={`url(${space.wallpaper_path})`}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Box position="absolute" inset="0" bg="blackAlpha.500" />
      <Box position="absolute" bottom="1" left="2" right="2">
        <Text fontSize="xs" color="white" fontWeight="medium" textAlign="left">
          {space.name}
        </Text>
      </Box>
      {isActive && (
        <Box
          position="absolute"
          top="1.5"
          right="1.5"
          w="2"
          h="2"
          borderRadius="full"
          bg="sage.300"
        />
      )}
    </Box>
  );
}
```

- [ ] **Step 4: Create SpaceGrid**

```tsx
// components/spaces/SpaceGrid.tsx
"use client";

import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { SPACES } from "@/lib/supabase/spaces";
import { SpaceCard } from "./SpaceCard";

export function SpaceGrid() {
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="0.15em"
        mb="3"
      >
        Spaces
      </Text>
      <SimpleGrid columns={2} gap="2">
        {SPACES.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/spaces/ lib/supabase/spaces.ts
git commit -m "feat: add Space components (background, card, grid) with palette switching"
```

---

### Task 12: Dashboard Page + Integration

**Files:**

- Create: `app/(dashboard)/page.tsx`
- Create: `app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create dashboard layout**

```tsx
// app/(dashboard)/layout.tsx
"use client";

import { useHydration } from "@/hooks/useHydration";
import { Box, Text } from "@chakra-ui/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const hasHydrated = useHydration();

  if (!hasHydrated) {
    return (
      <Box minH="100vh" bg="bg" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.muted" fontSize="sm">
          Loading...
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Create main workspace page**

```tsx
// app/(dashboard)/page.tsx
"use client";

import { VStack, HStack, Box, Text } from "@chakra-ui/react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { SpaceBackground } from "@/components/spaces/SpaceBackground";
import { SpaceGrid } from "@/components/spaces/SpaceGrid";
import { PomodoroRing } from "@/components/timer/PomodoroRing";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { TimerControls } from "@/components/timer/TimerControls";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { TodoList } from "@/components/todos/TodoList";
import { ProjectNameInput } from "@/components/session/ProjectNameInput";
import { useTimer } from "@/hooks/useTimer";
import { useAppStore } from "@/store";
import { getSpaceById } from "@/lib/supabase/spaces";

function FocusWorkspace() {
  const { minutes, seconds, progress, timerStatus } = useTimer();
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const space = getSpaceById(activeSpaceId);
  const isBreak = timerStatus === "break";
  const label = isBreak ? "Break" : "Focus";

  return (
    <VStack h="100vh" py="4" px="8" gap="4" justify="center" position="relative">
      {/* Space name + status */}
      <HStack gap="2" align="center">
        <Box w="2" h="2" borderRadius="full" bg="sage.300" />
        <Text fontSize="sm" color="fg.secondary">
          {space?.name ?? "Rainy Library"}
        </Text>
      </HStack>

      {/* Mood picker */}
      <MoodPicker />

      {/* Timer */}
      <Box position="relative" display="flex" alignItems="center" justifyContent="center">
        <PomodoroRing progress={progress} isBreak={isBreak} />
        <Box position="absolute">
          <TimerDisplay minutes={minutes} seconds={seconds} label={label} />
        </Box>
      </Box>

      {/* Project name */}
      <ProjectNameInput />

      {/* Timer controls */}
      <TimerControls />

      {/* Notes + Todos row */}
      <HStack w="full" maxW="600px" gap="4" flex="1" minH="0" pb="4">
        <NotesPanel />
        <TodoList />
      </HStack>
    </VStack>
  );
}

function RightPanelContent() {
  return (
    <VStack gap="6" w="full">
      {/* Companion placeholder */}
      <VStack gap="2" w="full" align="center">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.15em"
        >
          Your Buddy
        </Text>
        <Box
          w="full"
          h="180px"
          bg="bg.surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="fg.dim" fontSize="sm">
            Coming in Stage 3
          </Text>
        </Box>
      </VStack>

      {/* Sound mixer placeholder */}
      <VStack gap="2" w="full" align="start">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.15em"
        >
          Ambient Sounds
        </Text>
        <Box
          w="full"
          h="120px"
          bg="bg.surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="fg.dim" fontSize="sm">
            Coming in Stage 3
          </Text>
        </Box>
      </VStack>

      {/* Spaces */}
      <SpaceGrid />
    </VStack>
  );
}

export default function DashboardPage() {
  return (
    <>
      <SpaceBackground />
      <WorkspaceLayout rightPanel={<RightPanelContent />}>
        <FocusWorkspace />
      </WorkspaceLayout>
    </>
  );
}
```

- [ ] **Step 3: Update root page to redirect to dashboard**

Update `app/page.tsx` to redirect:

```tsx
// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/");
}
```

Wait — the dashboard IS at `/` since it's in `(dashboard)` route group. So `app/page.tsx` and `app/(dashboard)/page.tsx` would conflict. Instead, **delete** `app/page.tsx` and let `app/(dashboard)/page.tsx` serve as the root page.

Actually, route groups with `(dashboard)` means the URL path is just `/`. But `app/page.tsx` also serves `/`. This is a conflict. The solution: remove `app/page.tsx` and use `app/(dashboard)/page.tsx` as the root page.

- [ ] **Step 4: Delete app/page.tsx**

```bash
rm app/page.tsx
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/ components/ hooks/ store/ lib/ && git rm app/page.tsx 2>/dev/null; true
git commit -m "feat: compose full focus workspace with timer, notes, todos, and space switching"
```

---

### Task 13: Source Wallpaper Images

**Files:**

- Add: `public/wallpapers/*.jpg` (8 images)

- [ ] **Step 1: Source and download 8 curated dark/cozy wallpapers**

Find and download 8 free-license (Unsplash, Pexels, or similar) dark/moody wallpaper images. Each should be:

- Dark, atmospheric, cozy aesthetic
- Landscape orientation, minimum 1920x1080
- Optimized to under 500KB each (compress with quality 80)
- Named to match space wallpaper_path references:
  - `rainy-library.jpg`
  - `ocean-cabin.jpg`
  - `mountain-lodge.jpg`
  - `zen-garden.jpg`
  - `sunset-desert.jpg`
  - `midnight-city.jpg`
  - `autumn-cafe.jpg`
  - `northern-cabin.jpg`

If free images cannot be sourced programmatically, create solid gradient placeholder images using ImageMagick or a simple script, using each space's `bg_primary` and `bg_secondary` colors.

- [ ] **Step 2: Commit**

```bash
git add public/wallpapers/
git commit -m "feat: add curated space wallpaper images"
```

---

## Stage 2 Exit Criteria Checklist

- [ ] Full 3-column layout visible (nav | workspace | right panel)
- [ ] Timer counts down with SVG ring animation
- [ ] Play/pause/reset/skip controls work
- [ ] Mood picker changes timer durations
- [ ] Notes auto-save on debounced change
- [ ] Todos: add, check, delete, drag-reorder all work
- [ ] Space switching changes wallpaper and color palette
- [ ] State persists across page refresh (IndexedDB)
- [ ] `npm run build` succeeds with no errors

**Human checkpoint:** Does the layout feel like the mockup? Does the timer work smoothly? Do notes and todos survive refresh?
