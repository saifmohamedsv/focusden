"use client";

import { useAppStore } from "@/store";

export function QuickStart() {
  const setWorkDuration = useAppStore((s) => s.setWorkDuration);
  const setBreakDuration = useAppStore((s) => s.setBreakDuration);
  const startTimer = useAppStore((s) => s.startTimer);

  function handleClick() {
    setWorkDuration(5);
    setBreakDuration(2);
    startTimer();
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: "transparent",
        border: "1px solid transparent",
        borderRadius: "9999px",
        padding: "6px 18px",
        fontSize: "0.78rem",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "border-color 0.2s, color 0.2s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.color = "var(--color-text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
    >
      I need 5 minutes
    </button>
  );
}
