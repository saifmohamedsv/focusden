"use client";

import { Box, Text } from "@chakra-ui/react";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  label: string;
}

export function TimerDisplay({ minutes, seconds, label }: TimerDisplayProps) {
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return (
    <Box textAlign="center">
      <Text
        fontSize="timer"
        fontWeight="light"
        color="fg"
        fontFamily="mono"
        letterSpacing="0.08em"
        lineHeight="1"
        opacity={0.9}
      >
        {timeStr}
      </Text>
      <Text
        fontSize="xs"
        fontWeight="medium"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="0.25em"
        mt="3"
        opacity={0.7}
      >
        {label}
      </Text>
    </Box>
  );
}
