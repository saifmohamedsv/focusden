"use client";

interface DayData {
  date: string;
  minutes: number;
}

interface WeeklyChartProps {
  data: DayData[];
}

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayAbbr(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return DAY_ABBR[d.getDay()];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);

  const svgWidth = 420;
  const svgHeight = 180;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 24;
  const padBottom = 36;
  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;
  const barCount = data.length;
  const barGap = 10;
  const barWidth = (chartWidth - barGap * (barCount - 1)) / barCount;

  // Grid lines at 0%, 50%, 100%
  const gridLines = [0, 0.5, 1];

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      style={{ display: "block", maxWidth: "100%" }}
      aria-label="Weekly focus minutes bar chart"
    >
      {/* Grid lines */}
      {gridLines.map((frac) => {
        const y = padTop + chartHeight * (1 - frac);
        return (
          <line
            key={frac}
            x1={padLeft}
            y1={y}
            x2={svgWidth - padRight}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Y-axis label at top */}
      <text
        x={padLeft - 4}
        y={padTop}
        textAnchor="end"
        fontSize="9"
        fill="rgba(255,255,255,0.25)"
        dominantBaseline="middle"
      >
        {maxMinutes}
      </text>
      <text
        x={padLeft - 4}
        y={padTop + chartHeight / 2}
        textAnchor="end"
        fontSize="9"
        fill="rgba(255,255,255,0.25)"
        dominantBaseline="middle"
      >
        {Math.round(maxMinutes / 2)}
      </text>

      {/* Bars */}
      {data.map((d, i) => {
        const barHeightPx = (d.minutes / maxMinutes) * chartHeight;
        const x = padLeft + i * (barWidth + barGap);
        const y = padTop + chartHeight - barHeightPx;
        const hasValue = d.minutes > 0;

        return (
          <g key={d.date}>
            {/* Bar with rounded top caps */}
            {hasValue && (
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeightPx}
                rx={barWidth / 2}
                ry={barWidth / 2}
                fill="var(--chakra-colors-accent, #c8a97e)"
                opacity="0.85"
              />
            )}
            {/* Empty bar placeholder */}
            {!hasValue && (
              <rect
                x={x}
                y={padTop + chartHeight - 4}
                width={barWidth}
                height={4}
                rx={2}
                ry={2}
                fill="rgba(255,255,255,0.07)"
              />
            )}
            {/* Minutes label on top of bar */}
            {hasValue && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.55)"
                dominantBaseline="auto"
              >
                {d.minutes}
              </text>
            )}
            {/* Day abbreviation below */}
            <text
              x={x + barWidth / 2}
              y={padTop + chartHeight + 14}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.4)"
            >
              {getDayAbbr(d.date)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
