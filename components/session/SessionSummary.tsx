"use client";

import { useAppStore } from "@/store";

interface SessionSummaryProps {
  totalRounds: number;
  totalFocusMinutes: number;
  todosCompleted: number;
  spaceName: string;
  onDone: () => void;
}

export function SessionSummary({
  totalRounds,
  totalFocusMinutes,
  todosCompleted,
  spaceName,
  onDone,
}: SessionSummaryProps) {
  const resetTimer = useAppStore((s) => s.resetTimer);

  function handleDone() {
    resetTimer();
    onDone();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "var(--color-bg-surface, rgba(255,255,255,0.06))",
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          padding: "36px 40px 32px",
          minWidth: "300px",
          maxWidth: "380px",
          width: "90vw",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "var(--color-accent)",
            marginBottom: "6px",
            letterSpacing: "0.01em",
          }}
        >
          Session complete!
        </div>

        {/* Space name */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-secondary)",
            marginBottom: "28px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          {spaceName}
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
            gap: "0",
            marginBottom: "28px",
          }}
        >
          <StatCell value={totalRounds} label="rounds" />

          <div
            style={{
              width: "1px",
              background: "var(--color-border)",
              alignSelf: "stretch",
            }}
          />

          <StatCell value={totalFocusMinutes} label="min focused" />

          <div
            style={{
              width: "1px",
              background: "var(--color-border)",
              alignSelf: "stretch",
            }}
          />

          <StatCell value={todosCompleted} label="todos done" />
        </div>

        {/* Done button */}
        <button
          onClick={handleDone}
          style={{
            width: "100%",
            padding: "10px 20px",
            borderRadius: "9999px",
            background: "var(--color-accent)",
            color: "var(--color-bg-primary)",
            border: "none",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

interface StatCellProps {
  value: number;
  label: string;
}

function StatCell({ value, label }: StatCellProps) {
  return (
    <div style={{ textAlign: "center", padding: "0 12px" }}>
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 300,
          color: "var(--color-text-primary)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.62rem",
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
