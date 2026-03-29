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
      intervalRef.current = setInterval(() => { tick(); }, 1000);
    }
    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [timerStatus, tick]);

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
