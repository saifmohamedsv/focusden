"use client";

import { useEffect, useRef, useCallback } from "react";

export function useIdle(timeoutMs: number, onIdle: () => void, onActive?: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdleRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isIdleRef.current && onActive) {
      isIdleRef.current = false;
      onActive();
    }

    timerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      onIdle();
    }, timeoutMs);
  }, [timeoutMs, onIdle, onActive]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);
}
