# Pomodoro UX Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the focus workspace more interactive and polished — scoped space theming, transition cards between focus/break, click-to-edit durations, and floating overlay for notes/todos.

**Architecture:** 6 tasks in dependency order: scoped theming (global change) → timer state updates → transition card UI → click-to-edit → floating panel → expandable notes/todos.

**Tech Stack:** Chakra UI v3, Zustand, React state for local UI modes

**Spec:** `docs/superpowers/specs/2026-03-29-pomodoro-ux-enhancements-design.md`

---

## File Structure

```
Modified:
  types/index.ts                          — add transition timer statuses
  store/slices/timerSlice.ts              — add transition states + extendBreak
  hooks/useTimer.ts                       — handle transitions, auto-continue timeout
  theme/palettes.ts                       — scope applyPalette to 4 vars only
  app/globals.css                         — make text/border/surface static
  components/timer/TimerDisplay.tsx       — add click-to-edit mode
  components/notes/NotesPanel.tsx         — add expand button + floating mode
  components/todos/TodoList.tsx           — add expand button + floating mode
  app/(dashboard)/page.tsx               — render TransitionCard conditionally

Created:
  components/timer/TransitionCard.tsx     — inline card between focus/break
  components/ui/FloatingPanel.tsx         — reusable floating overlay
```

---

### Task 1: Scoped Space Theming

**Files:**
- Modify: `theme/palettes.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Update applyPalette to only set 4 scoped variables**

In `theme/palettes.ts`, change `applyPalette` to only set bg and accent vars:

```typescript
export function applyPalette(palette: SpacePalette): void {
  const root = document.documentElement;
  root.style.setProperty("--color-bg-primary", palette.bg_primary);
  root.style.setProperty("--color-bg-secondary", palette.bg_secondary);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-accent-hover", palette.accent_hover);
  // text, border, surface stay constant — base theme only
}
```

- [ ] **Step 2: Make text/border/surface static in globals.css**

Update `app/globals.css` — remove text/border/surface from the transition list since they no longer change:

```css
@import "tailwindcss";

:root {
  /* Space-scoped — change per space */
  --color-bg-primary: #181713;
  --color-bg-secondary: #221f18;
  --color-accent: #C8894A;
  --color-accent-hover: #d4a560;

  /* Base theme — constant across all spaces */
  --color-text-primary: #EDE5D0;
  --color-text-secondary: #A89880;
  --color-border: rgba(255, 255, 255, 0.07);
  --color-surface: #2a2620;

  /* Only transition space-scoped variables */
  transition: --color-bg-primary 0.6s ease,
    --color-bg-secondary 0.6s ease,
    --color-accent 0.6s ease,
    --color-accent-hover 0.6s ease;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: "DM Sans", system-ui, sans-serif;
  overflow: hidden;
  height: 100vh;
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add theme/palettes.ts app/globals.css
git commit -m "refactor: scope space theming to wallpaper + accent only"
```

---

### Task 2: Timer Transition States

**Files:**
- Modify: `types/index.ts`
- Modify: `store/slices/timerSlice.ts`

- [ ] **Step 1: Update TimerStatus type**

In `types/index.ts`, change:

```typescript
export type TimerStatus = 'idle' | 'running' | 'paused' | 'break' | 'transition_to_break' | 'transition_to_focus';
```

- [ ] **Step 2: Update timer slice with transition states**

In `store/slices/timerSlice.ts`, update the interface and implementation:

```typescript
import { StateCreator } from "zustand";

export interface TimerSlice {
  timerStatus: "idle" | "running" | "paused" | "break" | "transition_to_break" | "transition_to_focus";
  timeRemaining: number;
  workDuration: number;
  breakDuration: number;
  currentRound: number;
  lastFocusDuration: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchToBreak: () => void;
  switchToWork: () => void;
  transitionToBreak: () => void;
  transitionToFocus: () => void;
  extendBreak: (minutes: number) => void;
  continueWorking: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (set, get) => ({
  timerStatus: "idle",
  timeRemaining: 25 * 60,
  workDuration: 25,
  breakDuration: 5,
  currentRound: 1,
  lastFocusDuration: 0,

  startTimer: () => set({ timerStatus: "running" }),
  pauseTimer: () => set({ timerStatus: "paused" }),
  resetTimer: () =>
    set((state) => ({
      timerStatus: "idle",
      timeRemaining: state.workDuration * 60,
      currentRound: 1,
      lastFocusDuration: 0,
    })),
  tick: () => {
    const { timeRemaining, timerStatus } = get();
    if (timerStatus !== "running" && timerStatus !== "break") return;
    if (timeRemaining <= 1) {
      if (timerStatus === "running") {
        get().transitionToBreak();
      } else {
        get().transitionToFocus();
      }
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },
  transitionToBreak: () =>
    set((state) => ({
      timerStatus: "transition_to_break",
      lastFocusDuration: state.workDuration,
    })),
  transitionToFocus: () =>
    set({ timerStatus: "transition_to_focus" }),
  switchToBreak: () =>
    set((state) => ({
      timerStatus: "break",
      timeRemaining: state.breakDuration * 60,
    })),
  switchToWork: () =>
    set((state) => ({
      timerStatus: "running",
      timeRemaining: state.workDuration * 60,
      currentRound: state.currentRound + 1,
      lastFocusDuration: 0,
    })),
  continueWorking: () =>
    set((state) => ({
      timerStatus: "running",
      timeRemaining: state.workDuration * 60,
    })),
  extendBreak: (minutes) =>
    set((state) => ({
      timerStatus: "break",
      timeRemaining: state.timeRemaining + minutes * 60,
    })),
  setWorkDuration: (minutes) =>
    set((state) => ({
      workDuration: minutes,
      timeRemaining: state.timerStatus === "idle" ? minutes * 60 : state.timeRemaining,
    })),
  setBreakDuration: (minutes) => set({ breakDuration: minutes }),
});
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add types/index.ts store/slices/timerSlice.ts
git commit -m "feat: add transition timer states and extendBreak/continueWorking actions"
```

---

### Task 3: Transition Card + useTimer Updates

**Files:**
- Create: `components/timer/TransitionCard.tsx`
- Modify: `hooks/useTimer.ts`
- Modify: `app/(dashboard)/page.tsx`

- [ ] **Step 1: Create TransitionCard component**

```tsx
// components/timer/TransitionCard.tsx
"use client";

import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store";

interface TransitionCardProps {
  type: "focus_complete" | "break_complete";
}

export function TransitionCard({ type }: TransitionCardProps) {
  const switchToBreak = useAppStore((s) => s.switchToBreak);
  const switchToWork = useAppStore((s) => s.switchToWork);
  const continueWorking = useAppStore((s) => s.continueWorking);
  const extendBreak = useAppStore((s) => s.extendBreak);
  const lastFocusDuration = useAppStore((s) => s.lastFocusDuration);
  const todos = useAppStore((s) => s.todos);
  const completedCount = todos.filter((t) => t.completed).length;

  const [autoProgress, setAutoProgress] = useState(0);

  // Auto-continue after 10 seconds
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 10000, 1);
      setAutoProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        if (type === "focus_complete") {
          switchToBreak();
        } else {
          switchToWork();
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [type, switchToBreak, switchToWork]);

  const isFocusComplete = type === "focus_complete";

  return (
    <VStack
      gap="5"
      bg="bg.panel"
      border="1px solid"
      borderColor="border"
      borderRadius="2xl"
      p="8"
      maxW="340px"
      w="full"
      position="relative"
      overflow="hidden"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
    >
      {/* Title */}
      <Text
        fontSize="xl"
        fontFamily="heading"
        fontWeight="semibold"
        color={isFocusComplete ? "accent" : "success"}
      >
        {isFocusComplete ? "Focus complete!" : "Break\u2019s over!"}
      </Text>

      {/* Stats */}
      {isFocusComplete && (
        <HStack gap="6" justify="center">
          <VStack gap="0">
            <Text fontSize="2xl" fontWeight="semibold" color="fg">
              {lastFocusDuration}
            </Text>
            <Text fontSize="xs" color="fg.muted">min focused</Text>
          </VStack>
          <VStack gap="0">
            <Text fontSize="2xl" fontWeight="semibold" color="fg">
              {completedCount}
            </Text>
            <Text fontSize="xs" color="fg.muted">todos done</Text>
          </VStack>
        </HStack>
      )}

      {/* Action buttons */}
      <HStack gap="3" w="full" justify="center">
        {isFocusComplete ? (
          <>
            <button
              onClick={switchToBreak}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                background: "var(--color-accent)",
                color: "var(--color-bg-primary)",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
              }}
            >
              Take a break
            </button>
            <button
              onClick={continueWorking}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                background: "transparent",
                color: "var(--color-text-secondary)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.15s",
              }}
            >
              Keep going
            </button>
          </>
        ) : (
          <>
            <button
              onClick={switchToWork}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                background: "var(--color-accent)",
                color: "var(--color-bg-primary)",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Start focusing
            </button>
            <button
              onClick={() => extendBreak(2)}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                background: "transparent",
                color: "var(--color-text-secondary)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              +2 min
            </button>
          </>
        )}
      </HStack>

      {/* Auto-continue progress bar */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        h="3px"
        bg={isFocusComplete ? "accent" : "success"}
        opacity={0.6}
        borderRadius="full"
        style={{
          width: `${autoProgress * 100}%`,
          transition: "width 50ms linear",
        }}
      />
    </VStack>
  );
}
```

- [ ] **Step 2: Update useTimer to handle transition states**

In `hooks/useTimer.ts`, update the `useEffect` that manages the global interval to NOT tick during transition states (they're already handled). Also expose new actions:

```typescript
"use client";

import { useEffect, useCallback } from "react";
import { useAppStore } from "@/store";

let globalInterval: ReturnType<typeof setInterval> | null = null;
let intervalOwnerCount = 0;

function startGlobalInterval() {
  if (globalInterval) return;
  globalInterval = setInterval(() => {
    useAppStore.getState().tick();
  }, 1000);
}

function stopGlobalInterval() {
  if (globalInterval) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
}

export function useTimer() {
  const timerStatus = useAppStore((s) => s.timerStatus);
  const timeRemaining = useAppStore((s) => s.timeRemaining);
  const workDuration = useAppStore((s) => s.workDuration);
  const breakDuration = useAppStore((s) => s.breakDuration);
  const currentRound = useAppStore((s) => s.currentRound);
  const startTimer = useAppStore((s) => s.startTimer);
  const pauseTimer = useAppStore((s) => s.pauseTimer);
  const resetTimer = useAppStore((s) => s.resetTimer);

  useEffect(() => {
    intervalOwnerCount++;
    return () => {
      intervalOwnerCount--;
      if (intervalOwnerCount === 0) {
        stopGlobalInterval();
      }
    };
  }, []);

  useEffect(() => {
    if (timerStatus === "running" || timerStatus === "break") {
      startGlobalInterval();
    } else {
      stopGlobalInterval();
    }
  }, [timerStatus]);

  const toggleTimer = useCallback(() => {
    if (timerStatus === "running" || timerStatus === "break") { pauseTimer(); }
    else if (timerStatus === "idle" || timerStatus === "paused") { startTimer(); }
  }, [timerStatus, startTimer, pauseTimer]);

  const skipToNext = useCallback(() => {
    if (timerStatus === "running" || timerStatus === "paused") { useAppStore.getState().transitionToBreak(); }
    else if (timerStatus === "break") { useAppStore.getState().transitionToFocus(); }
  }, [timerStatus]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = timerStatus === "break"
    ? 1 - timeRemaining / (breakDuration * 60)
    : 1 - timeRemaining / (workDuration * 60);

  const isTransition = timerStatus === "transition_to_break" || timerStatus === "transition_to_focus";

  return {
    timerStatus, timeRemaining, minutes, seconds, progress, currentRound,
    workDuration, breakDuration,
    isRunning: timerStatus === "running" || timerStatus === "break",
    isTransition,
    toggleTimer, resetTimer, skipToNext,
  };
}
```

- [ ] **Step 3: Update dashboard page to show TransitionCard**

In `app/(dashboard)/page.tsx`, inside the `FocusWorkspace` component, conditionally render `TransitionCard` instead of the timer when in transition state:

In the timer zone area, wrap the PomodoroRing/TimerDisplay/controls in a conditional:

```tsx
// Add import at top
import { TransitionCard } from "@/components/timer/TransitionCard";

// In FocusWorkspace, get isTransition from useTimer:
const { minutes, seconds, progress, timerStatus, currentRound, isTransition } = useTimer();

// Replace the timer zone VStack content with:
{isTransition ? (
  <TransitionCard
    type={timerStatus === "transition_to_break" ? "focus_complete" : "break_complete"}
  />
) : (
  <>
    {/* Pomodoro ring with timer display */}
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
      <PomodoroRing progress={progress} isBreak={isBreak} />
      <Box position="absolute" top="50%" left="50%" style={{ transform: "translate(-50%, -50%)" }} textAlign="center">
        <TimerDisplay minutes={minutes} seconds={seconds} label={timerLabel} />
      </Box>
    </Box>

    {/* Round dots */}
    <HStack gap="2" justify="center">
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} w="8px" h="8px" borderRadius="full" bg={i < currentRound ? "accent" : "rgba(255,255,255,0.1)"} transition="background 0.3s ease" />
      ))}
    </HStack>

    {/* Timer controls */}
    <TimerControls />

    {/* Project name */}
    <Box w="100%" maxW="240px" textAlign="center" opacity={0.7} _hover={{ opacity: 1 }} transition="opacity 0.2s">
      <ProjectNameInput />
    </Box>
  </>
)}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/timer/TransitionCard.tsx hooks/useTimer.ts "app/(dashboard)/page.tsx"
git commit -m "feat: add transition cards between focus and break sessions"
```

---

### Task 4: Click-to-Edit Timer Durations

**Files:**
- Modify: `components/timer/TimerDisplay.tsx`

- [ ] **Step 1: Add edit mode to TimerDisplay**

```tsx
// components/timer/TimerDisplay.tsx
"use client";

import { Box, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  label: string;
  isEditable?: boolean;
}

export function TimerDisplay({ minutes, seconds, label, isEditable = false }: TimerDisplayProps) {
  const [editingFocus, setEditingFocus] = useState(false);
  const [editingBreak, setEditingBreak] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const workDuration = useAppStore((s) => s.workDuration);
  const breakDuration = useAppStore((s) => s.breakDuration);
  const setWorkDuration = useAppStore((s) => s.setWorkDuration);
  const setBreakDuration = useAppStore((s) => s.setBreakDuration);
  const setMood = useAppStore((s) => s.setMood);

  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  useEffect(() => {
    if ((editingFocus || editingBreak) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingFocus, editingBreak]);

  const handleFocusClick = () => {
    if (!isEditable) return;
    setEditValue(String(workDuration));
    setEditingFocus(true);
  };

  const handleBreakClick = () => {
    if (!isEditable) return;
    setEditValue(String(breakDuration));
    setEditingBreak(true);
  };

  const confirmEdit = () => {
    const num = parseInt(editValue, 10);
    if (editingFocus && num >= 5 && num <= 60) {
      setWorkDuration(num);
      setMood(null); // manual edit clears mood
    } else if (editingBreak && num >= 1 && num <= 30) {
      setBreakDuration(num);
      setMood(null);
    }
    setEditingFocus(false);
    setEditingBreak(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmEdit();
    if (e.key === "Escape") {
      setEditingFocus(false);
      setEditingBreak(false);
    }
  };

  return (
    <Box textAlign="center">
      {/* Time display / edit */}
      {editingFocus ? (
        <Box display="inline-flex" alignItems="baseline" gap="1">
          <input
            ref={inputRef}
            type="number"
            min={5}
            max={60}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={handleKeyDown}
            style={{
              width: "64px",
              fontSize: "3rem",
              fontWeight: 300,
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--color-text-primary)",
              background: "transparent",
              border: "none",
              borderBottom: "2px solid var(--color-accent)",
              outline: "none",
              textAlign: "center",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          />
          <Text fontSize="sm" color="fg.muted" opacity={0.5}>min</Text>
        </Box>
      ) : (
        <Text
          fontSize="timer"
          fontWeight="light"
          color="fg"
          fontFamily="mono"
          letterSpacing="0.08em"
          lineHeight="1"
          opacity={0.9}
          cursor={isEditable ? "text" : "default"}
          onClick={handleFocusClick}
          _hover={isEditable ? { borderBottom: "1px solid", borderColor: "accent", opacity: 1 } : {}}
          transition="all 0.15s"
          pb="1px"
        >
          {timeStr}
        </Text>
      )}

      {/* Label / break edit */}
      {editingBreak ? (
        <Box display="inline-flex" alignItems="baseline" gap="1" mt="2">
          <input
            ref={inputRef}
            type="number"
            min={1}
            max={30}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={handleKeyDown}
            style={{
              width: "40px",
              fontSize: "0.75rem",
              fontWeight: 500,
              fontFamily: "inherit",
              color: "var(--color-text-secondary)",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--color-accent)",
              outline: "none",
              textAlign: "center",
            }}
          />
          <Text fontSize="xs" color="fg.muted">min break</Text>
        </Box>
      ) : (
        <Text
          fontSize="xs"
          fontWeight="medium"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.25em"
          mt="3"
          opacity={0.7}
          cursor={isEditable ? "pointer" : "default"}
          onClick={handleBreakClick}
          _hover={isEditable ? { opacity: 1, color: "fg.secondary" } : {}}
          transition="all 0.15s"
        >
          {isEditable && label === "Focus" ? `${breakDuration} min break` : label}
        </Text>
      )}
    </Box>
  );
}
```

- [ ] **Step 2: Pass isEditable prop from dashboard page**

In `app/(dashboard)/page.tsx`, update the TimerDisplay usage to pass `isEditable` when timer is idle:

```tsx
<TimerDisplay
  minutes={minutes}
  seconds={seconds}
  label={timerLabel}
  isEditable={timerStatus === "idle"}
/>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/timer/TimerDisplay.tsx "app/(dashboard)/page.tsx"
git commit -m "feat: add click-to-edit for focus and break durations when timer is idle"
```

---

### Task 5: Floating Panel Component

**Files:**
- Create: `components/ui/FloatingPanel.tsx`

- [ ] **Step 1: Create reusable floating overlay**

```tsx
// components/ui/FloatingPanel.tsx
"use client";

import { Box, Text } from "@chakra-ui/react";
import { useEffect, useCallback } from "react";

interface FloatingPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function FloatingPanel({ title, onClose, children }: FloatingPanelProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Backdrop */}
      <Box
        position="absolute"
        inset="0"
        bg="blackAlpha.400"
        backdropFilter="blur(8px)"
        onClick={onClose}
      />

      {/* Card */}
      <Box
        position="relative"
        bg="bg.panel"
        border="1px solid"
        borderColor="border"
        borderRadius="2xl"
        w="full"
        maxW="560px"
        maxH="70vh"
        mx="4"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px="5"
          py="3"
          borderBottom="1px solid"
          borderColor="border"
          flexShrink={0}
        >
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="fg.muted"
            textTransform="uppercase"
            letterSpacing="0.15em"
          >
            {title}
          </Text>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-secondary)",
              fontSize: "18px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "8px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </Box>

        {/* Content */}
        <Box flex="1" overflow="auto" p="5" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Remove components/ui/.gitkeep**

```bash
rm -f components/ui/.gitkeep
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/FloatingPanel.tsx
git commit -m "feat: add reusable FloatingPanel overlay component"
```

---

### Task 6: Expandable Notes and Todos

**Files:**
- Modify: `components/notes/NotesPanel.tsx`
- Modify: `components/todos/TodoList.tsx`

- [ ] **Step 1: Add expand button and floating mode to NotesPanel**

```tsx
// components/notes/NotesPanel.tsx
"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useRef, useCallback, useState } from "react";
import { useAppStore } from "@/store";
import { FloatingPanel } from "@/components/ui/FloatingPanel";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

export function NotesPanel() {
  const notesContent = useAppStore((s) => s.notesContent);
  const setNotes = useAppStore((s) => s.setNotes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expanded, setExpanded] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = useCallback((e: any) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setNotes(value); }, 500);
  }, [setNotes]);

  const textareaStyle = (height: string): React.CSSProperties => ({
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--chakra-colors-fg-secondary, var(--color-text-secondary))",
    fontSize: "1rem",
    resize: "none",
    lineHeight: "1.7",
    fontFamily: "inherit",
    width: "100%",
    minHeight: height,
  });

  return (
    <>
      <Box bg="bg.panel" border="1px solid" borderColor="border" borderRadius="xl" p="4" flex="1" display="flex" flexDirection="column" minH="0">
        <HStack justify="space-between" mb="3">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">Notes</Text>
          <HStack gap="1">
            <IconButton aria-label="Expand notes" variant="ghost" size="sm" rounded="full" onClick={() => setExpanded(true)}>
              <ExpandIcon />
            </IconButton>
            <IconButton aria-label="Add note" variant="ghost" size="sm" rounded="full"><PlusIcon /></IconButton>
          </HStack>
        </HStack>
        <textarea
          defaultValue={notesContent}
          onChange={handleChange}
          placeholder="What are you working on..."
          style={textareaStyle("0")}
        />
      </Box>

      {expanded && (
        <FloatingPanel title="Notes" onClose={() => setExpanded(false)}>
          <textarea
            defaultValue={notesContent}
            onChange={handleChange}
            placeholder="What are you working on..."
            style={textareaStyle("300px")}
          />
        </FloatingPanel>
      )}
    </>
  );
}
```

- [ ] **Step 2: Add expand button and floating mode to TodoList**

```tsx
// components/todos/TodoList.tsx
"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAppStore } from "@/store";
import { TodoItem } from "./TodoItem";
import { FloatingPanel } from "@/components/ui/FloatingPanel";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function TodoContent({ showInput }: { showInput?: boolean }) {
  const todos = useAppStore((s) => s.todos);
  const addTodo = useAppStore((s) => s.addTodo);
  const reorderTodos = useAppStore((s) => s.reorderTodos);
  const [newTodoText, setNewTodoText] = useState("");
  const [isAdding, setIsAdding] = useState(showInput ?? false);

  const handleAdd = useCallback(() => {
    if (newTodoText.trim()) { addTodo(newTodoText.trim()); setNewTodoText(""); setIsAdding(false); }
  }, [newTodoText, addTodo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") { setNewTodoText(""); setIsAdding(false); }
  }, [handleAdd]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    reorderTodos(arrayMove(todos, oldIndex, newIndex));
  }, [todos, reorderTodos]);

  return (
    <>
      {isAdding && (
        <input
          value={newTodoText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="What needs doing..."
          autoFocus
          style={{
            marginBottom: "0.5rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px",
            padding: "0.375rem 0.75rem",
            fontSize: "0.875rem",
            color: "inherit",
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
          }}
        />
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (<TodoItem key={todo.id} todo={todo} />))}
        </SortableContext>
      </DndContext>
      {!isAdding && todos.length === 0 && (
        <Text color="fg.dim" fontSize="sm" textAlign="center" py="4">No todos yet</Text>
      )}
    </>
  );
}

export function TodoList() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Box bg="bg.panel" border="1px solid" borderColor="border" borderRadius="xl" p="4" flex="1" display="flex" flexDirection="column" minH="0">
        <HStack justify="space-between" mb="3">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">Todos</Text>
          <HStack gap="1">
            <IconButton aria-label="Expand todos" variant="ghost" size="sm" rounded="full" onClick={() => setExpanded(true)}>
              <ExpandIcon />
            </IconButton>
            <IconButton aria-label="Add todo" variant="ghost" size="sm" rounded="full" onClick={() => {}}>
              <PlusIcon />
            </IconButton>
          </HStack>
        </HStack>
        <Box flex="1" overflow="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
          <TodoContent />
        </Box>
      </Box>

      {expanded && (
        <FloatingPanel title="Todos" onClose={() => setExpanded(false)}>
          <TodoContent showInput />
        </FloatingPanel>
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/notes/NotesPanel.tsx components/todos/TodoList.tsx
git commit -m "feat: add expandable floating overlay for notes and todos panels"
```

---

## Exit Criteria

- [ ] Switching spaces only changes wallpaper + accent, not text/borders/nav
- [ ] Timer shows transition card when focus completes (with stats + auto-continue bar)
- [ ] Timer shows transition card when break ends (with action buttons)
- [ ] Clicking time digits when idle opens inline edit (5-60 min range)
- [ ] Clicking break label when idle opens inline edit (1-30 min range)
- [ ] Manual duration edit clears mood selection
- [ ] Notes panel has expand icon → opens floating overlay
- [ ] Todos panel has expand icon → opens floating overlay
- [ ] Floating panel closes on X, backdrop click, or Escape
- [ ] `npm run build` succeeds
