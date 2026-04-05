"use client";

import { useEffect, useCallback } from "react";
import { useAppStore } from "@/store";

// Single global interval — prevents duplicate ticking when multiple
// components call useTimer()
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
  const timerPhase = useAppStore((s) => s.timerPhase);
  const timeRemaining = useAppStore((s) => s.timeRemaining);
  const workDuration = useAppStore((s) => s.workDuration);
  const breakDuration = useAppStore((s) => s.breakDuration);
  const currentRound = useAppStore((s) => s.currentRound);
  const lastFocusDuration = useAppStore((s) => s.lastFocusDuration);
  const startTimer = useAppStore((s) => s.startTimer);
  const pauseTimer = useAppStore((s) => s.pauseTimer);
  const resetTimer = useAppStore((s) => s.resetTimer);

  const isTransition =
    timerStatus === "transition_to_break" || timerStatus === "transition_to_focus";

  // Manage the global tick interval
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

  // Sync to wall clock when tab becomes visible again (handles browser
  // throttling of background tabs and long sleeps)
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        const state = useAppStore.getState();
        if (state.timerStatus === "running" || state.timerStatus === "break") {
          state.syncToWallClock();
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const toggleTimer = useCallback(() => {
    if (isTransition) return;
    if (timerStatus === "running" || timerStatus === "break") {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [timerStatus, isTransition, startTimer, pauseTimer]);

  const skipToNext = useCallback(() => {
    if (timerStatus === "running" || timerStatus === "paused") {
      // Skip handles both work-paused and break-paused via timerPhase
      const phase = useAppStore.getState().timerPhase;
      if (phase === "break") {
        useAppStore.getState().transitionToFocus();
      } else {
        useAppStore.getState().transitionToBreak();
      }
    } else if (timerStatus === "break") {
      useAppStore.getState().transitionToFocus();
    }
  }, [timerStatus]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Progress: 0 when idle, otherwise computed from phase duration, clamped to [0, 1]
  let progress: number;
  if (timerStatus === "idle") {
    progress = 0;
  } else {
    const totalSeconds = timerPhase === "break" ? breakDuration * 60 : workDuration * 60;
    progress = totalSeconds > 0 ? Math.max(0, Math.min(1, 1 - timeRemaining / totalSeconds)) : 0;
  }

  return {
    timerStatus,
    timerPhase,
    timeRemaining,
    minutes,
    seconds,
    progress,
    currentRound,
    workDuration,
    breakDuration,
    lastFocusDuration,
    isRunning: timerStatus === "running" || timerStatus === "break",
    isTransition,
    toggleTimer,
    resetTimer,
    skipToNext,
  };
}
