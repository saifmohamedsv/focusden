"use client";

import { Box } from "@chakra-ui/react";

interface PomodoroRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isBreak?: boolean;
}

export function PomodoroRing({ progress, size = 300, strokeWidth = 5, isBreak = false }: PomodoroRingProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampedProgress);
  const accentColor = isBreak ? "var(--chakra-colors-sage-300, #6B8F71)" : "var(--color-accent)";

  return (
    <Box
      position="relative"
      width={`${size}px`}
      height={`${size}px`}
      filter={clampedProgress > 0 ? `drop-shadow(0 0 20px ${isBreak ? "rgba(107, 143, 113, 0.15)" : "rgba(200, 137, 74, 0.15)"})` : "none"}
      transition="filter 0.6s ease"
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
    </Box>
  );
}
