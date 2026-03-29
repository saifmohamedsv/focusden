"use client";

import { HStack, Box } from "@chakra-ui/react";
import { useTimer } from "@/hooks/useTimer";

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="7,4 20,12 7,20" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,4 15,12 5,20" />
      <rect x="17" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}

export function TimerControls() {
  const { timerStatus, isRunning, toggleTimer, resetTimer, skipToNext } = useTimer();
  const isIdle = timerStatus === "idle";

  return (
    <HStack gap="5" justify="center" align="center">
      {/* Reset */}
      <button
        onClick={isIdle ? undefined : resetTimer}
        aria-label="Reset timer"
        aria-disabled={isIdle}
        style={{
          opacity: isIdle ? 0.25 : 0.6,
          color: "var(--color-text-primary)",
          cursor: isIdle ? "default" : "pointer",
          transition: "opacity 0.2s",
          padding: "8px",
          borderRadius: "9999px",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => { if (!isIdle) e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = isIdle ? "0.25" : "0.6"; }}
      >
        <ResetIcon />
      </button>

      {/* Play / Pause — hero button */}
      <Box
        as="button"
        onClick={toggleTimer}
        w="56px"
        h="56px"
        borderRadius="full"
        bg="accent"
        color="bg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        boxShadow="0 0 24px rgba(200, 137, 74, 0.25)"
        _hover={{
          transform: "scale(1.06)",
          boxShadow: "0 0 32px rgba(200, 137, 74, 0.35)",
        }}
        _active={{ transform: "scale(0.96)" }}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </Box>

      {/* Skip */}
      <button
        onClick={isIdle ? undefined : skipToNext}
        aria-label="Skip to next"
        aria-disabled={isIdle}
        style={{
          opacity: isIdle ? 0.25 : 0.6,
          color: "var(--color-text-primary)",
          cursor: isIdle ? "default" : "pointer",
          transition: "opacity 0.2s",
          padding: "8px",
          borderRadius: "9999px",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => { if (!isIdle) e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = isIdle ? "0.25" : "0.6"; }}
      >
        <SkipIcon />
      </button>
    </HStack>
  );
}
