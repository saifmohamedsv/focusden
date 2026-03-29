"use client";

import { HStack, Text, Button } from "@chakra-ui/react";
import { useAppStore } from "@/store";
import { Mood, MOOD_CONFIGS } from "@/types";

const moods: { value: Mood; label: string }[] = [
  { value: "focused", label: "Focused" },
  { value: "calm", label: "Calm" },
  { value: "anxious", label: "Anxious" },
  { value: "restless", label: "Restless" },
];

export function MoodPicker() {
  const currentMood = useAppStore((s) => s.mood);
  const setMood = useAppStore((s) => s.setMood);
  const setWorkDuration = useAppStore((s) => s.setWorkDuration);
  const setBreakDuration = useAppStore((s) => s.setBreakDuration);
  const resetTimer = useAppStore((s) => s.resetTimer);
  const timerStatus = useAppStore((s) => s.timerStatus);

  const handleSelect = (mood: Mood) => {
    if (currentMood === mood) {
      setMood(null);
      setWorkDuration(25);
      setBreakDuration(5);
    } else {
      setMood(mood);
      const config = MOOD_CONFIGS[mood];
      setWorkDuration(config.workMinutes);
      setBreakDuration(config.breakMinutes);
    }
    // Always reset timer when mood changes — avoids broken state mid-session
    if (timerStatus !== "idle") {
      // Defer reset so new durations are applied first
      setTimeout(() => resetTimer(), 0);
    }
  };

  return (
    <HStack gap="3" align="center">
      <Text fontSize="sm" color="fg.muted" fontWeight="medium">
        Feeling
      </Text>
      {moods.map((m) => (
        <Button
          key={m.value}
          size="sm"
          variant={(currentMood === m.value ? "primary" : "surface") as "solid"}
          onClick={() => handleSelect(m.value)}
          rounded="full"
          fontSize="sm"
          px="4"
          py="1"
          h="auto"
        >
          {m.label}
        </Button>
      ))}
    </HStack>
  );
}
