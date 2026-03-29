"use client";

import { Box } from "@chakra-ui/react";

interface PomodoroRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isBreak?: boolean;
}

export function PomodoroRing({ progress, size = 280, strokeWidth = 6, isBreak = false }: PomodoroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <Box position="relative" width={`${size}px`} height={`${size}px`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-surface)" strokeWidth={strokeWidth} opacity={0.5} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={isBreak ? "var(--chakra-colors-sage-300)" : "var(--color-accent)"} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      </svg>
    </Box>
  );
}
