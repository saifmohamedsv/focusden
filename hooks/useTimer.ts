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
    else { startTimer(); }
  }, [timerStatus, startTimer, pauseTimer]);

  const skipToNext = useCallback(() => {
    if (timerStatus === "running" || timerStatus === "paused") { useAppStore.getState().switchToBreak(); }
    else if (timerStatus === "break") { useAppStore.getState().switchToWork(); }
  }, [timerStatus]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = timerStatus === "break"
    ? 1 - timeRemaining / (breakDuration * 60)
    : 1 - timeRemaining / (workDuration * 60);

  return { timerStatus, timeRemaining, minutes, seconds, progress, currentRound, workDuration, breakDuration, isRunning: timerStatus === "running" || timerStatus === "break", toggleTimer, resetTimer, skipToNext };
}
