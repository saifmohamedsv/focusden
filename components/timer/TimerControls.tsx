"use client";

import { HStack, IconButton } from "@chakra-ui/react";
import { useTimer } from "@/hooks/useTimer";

function ResetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,4 15,12 5,20" />
      <rect x="17" y="4" width="3" height="16" />
    </svg>
  );
}

// Chakra v3 types don't reflect custom recipe variants — cast to built-in
type BtnVariant = "ghost" | "solid";
type BtnSize = "sm" | "md" | "lg";

export function TimerControls() {
  const { timerStatus, isRunning, toggleTimer, resetTimer, skipToNext } = useTimer();
  return (
    <HStack gap="4" justify="center">
      <IconButton
        aria-label="Reset timer"
        variant={"ghost" as BtnVariant}
        size={"sm" as BtnSize}
        onClick={resetTimer}
        disabled={timerStatus === "idle"}
        rounded="full"
      >
        <ResetIcon />
      </IconButton>
      <IconButton
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        variant={"primary" as BtnVariant}
        size={"lg" as BtnSize}
        onClick={toggleTimer}
        rounded="full"
        w="14"
        h="14"
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <IconButton
        aria-label="Skip to next"
        variant={"ghost" as BtnVariant}
        size={"sm" as BtnSize}
        onClick={skipToNext}
        disabled={timerStatus === "idle"}
        rounded="full"
      >
        <SkipIcon />
      </IconButton>
    </HStack>
  );
}
