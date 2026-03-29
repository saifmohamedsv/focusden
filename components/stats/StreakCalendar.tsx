"use client";

interface StreakCalendarProps {
  streak: number;
  weeklyData: { date: string; minutes: number }[];
}

function getIntensityFill(minutes: number): string {
  if (minutes === 0) return "var(--chakra-colors-bg-surface, rgba(255,255,255,0.05))";
  if (minutes <= 15) return "rgba(200,169,126,0.30)";
  if (minutes <= 30) return "rgba(200,169,126,0.60)";
  return "var(--chakra-colors-accent, #c8a97e)";
}

export function StreakCalendar({ streak, weeklyData }: StreakCalendarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Streak number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "var(--chakra-colors-accent, #c8a97e)",
            lineHeight: 1,
            fontFamily: "var(--chakra-fonts-heading)",
          }}
        >
          {streak}
        </span>
        <span
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 500,
          }}
        >
          day{streak !== 1 ? "s" : ""} streak
        </span>
      </div>

      {/* Last 7 days squares */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {weeklyData.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.minutes} min`}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "5px",
              background: getIntensityFill(d.minutes),
              border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
              transition: "opacity 0.2s",
              cursor: "default",
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          marginTop: "2px",
        }}
      >
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>
          Less
        </span>
        {[0, 15, 30, 60].map((v) => (
          <div
            key={v}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              background: getIntensityFill(v),
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>
          More
        </span>
      </div>
    </div>
  );
}
