"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/store";
import { SessionSummary } from "@/components/session/SessionSummary";

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
  const currentRound = useAppStore((s) => s.currentRound);
  const workDuration = useAppStore((s) => s.workDuration);
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const todos = useAppStore((s) => s.todos);
  const resetTimer = useAppStore((s) => s.resetTimer);

  const [showSummary, setShowSummary] = useState(false);

  const totalFocusMinutes = currentRound * workDuration;
  const completedTodos = todos.filter((t) => t.completed).length;

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const primaryAction = useCallback(() => {
    if (cancelledRef.current) return;
    cancelledRef.current = true;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (mode === "focus_complete") {
      switchToBreak();
    } else {
      switchToWork();
    }
  }, [mode, switchToBreak, switchToWork]);

  const cancelAutoContinue = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    cancelledRef.current = false;

    function tick() {
      if (cancelledRef.current) return;
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
  const showEndSession = currentRound >= 3;
  const prefersReduced = useReducedMotion();
  const cardDuration = prefersReduced ? 0 : 0.3;

  if (showSummary) {
    return (
      <SessionSummary
        totalRounds={currentRound}
        totalFocusMinutes={totalFocusMinutes}
        todosCompleted={completedTodos}
        spaceName={activeSpaceId ?? "Focus session"}
        onDone={() => setShowSummary(false)}
      />
    );
  }

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: cardDuration, ease: "easeOut" }}
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
            cancelAutoContinue();
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

      {/* End session — visible from round 3 onwards */}
      {showEndSession && (
        <button
          onClick={() => { cancelAutoContinue(); setShowSummary(true); }}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "7px 14px",
            borderRadius: "9999px",
            background: "transparent",
            color: "var(--color-text-secondary)",
            border: "none",
            fontSize: "0.75rem",
            fontWeight: 400,
            cursor: "pointer",
            transition: "color 0.15s",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          End session
        </button>
      )}

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
    </motion.div>
  );
}
