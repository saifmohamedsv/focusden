"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store";

const AUTO_CONTINUE_SECONDS = 10;

interface TransitionCardProps {
  mode: "focus_complete" | "break_complete";
  lastFocusDuration: number;
  todosCompletedCount: number;
}

export function TransitionCard({ mode, lastFocusDuration, todosCompletedCount }: TransitionCardProps) {
  const switchToBreak = useAppStore((s) => s.switchToBreak);
  const switchToWork = useAppStore((s) => s.switchToWork);
  const continueWorking = useAppStore((s) => s.continueWorking);
  const extendBreak = useAppStore((s) => s.extendBreak);

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const primaryAction = useCallback(() => {
    if (mode === "focus_complete") {
      switchToBreak();
    } else {
      switchToWork();
    }
  }, [mode, switchToBreak, switchToWork]);

  useEffect(() => {
    startTimeRef.current = Date.now();

    function tick() {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const p = Math.min(elapsed / AUTO_CONTINUE_SECONDS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        primaryAction();
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [primaryAction]);

  const isFocusComplete = mode === "focus_complete";
  const titleColor = isFocusComplete ? "var(--color-accent)" : "var(--color-success, #6abf69)";
  const title = isFocusComplete ? "Focus complete!" : "Break's over!";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--color-bg-surface, rgba(255,255,255,0.06))",
        border: "1px solid var(--color-border)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        padding: "24px 28px 32px",
        minWidth: "260px",
        maxWidth: "340px",
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "1.15rem",
          fontWeight: 600,
          color: titleColor,
          marginBottom: "6px",
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </div>

      {/* Stats row — only for focus complete */}
      {isFocusComplete && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "4px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 300,
                color: "var(--color-text-primary)",
                lineHeight: 1.1,
              }}
            >
              {lastFocusDuration}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginTop: "2px",
              }}
            >
              min focused
            </div>
          </div>
          <div
            style={{
              width: "1px",
              background: "var(--color-border)",
              alignSelf: "stretch",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 300,
                color: "var(--color-text-primary)",
                lineHeight: 1.1,
              }}
            >
              {todosCompletedCount}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginTop: "2px",
              }}
            >
              todos done
            </div>
          </div>
        </div>
      )}

      {/* Subtitle for break complete */}
      {!isFocusComplete && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-secondary)",
            marginBottom: "20px",
            marginTop: "2px",
          }}
        >
          Ready to get back to it?
        </div>
      )}

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {/* Primary action */}
        <button
          onClick={primaryAction}
          style={{
            flex: 1,
            padding: "9px 14px",
            borderRadius: "9999px",
            background: "var(--color-accent)",
            color: "var(--color-bg-primary)",
            border: "none",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {isFocusComplete ? "Take a break" : "Start focusing"}
        </button>

        {/* Secondary action */}
        <button
          onClick={() => {
            if (isFocusComplete) {
              continueWorking();
            } else {
              extendBreak(2);
            }
          }}
          style={{
            flex: 1,
            padding: "9px 14px",
            borderRadius: "9999px",
            background: "transparent",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
            fontSize: "0.82rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {isFocusComplete ? "Keep going" : "+2 min"}
        </button>
      </div>

      {/* Auto-continue progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--color-border)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: titleColor,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}
