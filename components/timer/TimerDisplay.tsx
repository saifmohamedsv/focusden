"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { useAppStore } from "@/store";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  label: string;
  isEditable?: boolean;
}

/** Small up/down stepper arrows */
function ChevronUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Inline number stepper — replaces raw input with up/down buttons */
function InlineStepper({
  value,
  min,
  max,
  onChange,
  onDone,
  fontSize = "timer",
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  onDone: () => void;
  fontSize?: string;
  label?: string;
}) {
  const increment = () => onChange(Math.min(value + 1, max));
  const decrement = () => onChange(Math.max(value - 1, min));

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") onDone();
      if (e.key === "ArrowUp") { e.preventDefault(); increment(); }
      if (e.key === "ArrowDown") { e.preventDefault(); decrement(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  // Close on click outside
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onDone();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onDone]);

  const btnStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--color-accent)",
    padding: "4px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
    transition: "opacity 0.15s",
  };

  return (
    <VStack ref={containerRef} gap="0" align="center">
      <button
        onClick={increment}
        style={btnStyle}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
        aria-label={`Increase ${label ?? "value"}`}
      >
        <ChevronUp />
      </button>
      <Text
        fontSize={fontSize}
        fontWeight="light"
        color="accent"
        fontFamily="mono"
        letterSpacing="0.08em"
        lineHeight="1"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label ?? "value"}
        tabIndex={0}
      >
        {String(value).padStart(2, "0")}
      </Text>
      <button
        onClick={decrement}
        style={btnStyle}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
        aria-label={`Decrease ${label ?? "value"}`}
      >
        <ChevronDown />
      </button>
    </VStack>
  );
}

export function TimerDisplay({ minutes, seconds, label, isEditable = false }: TimerDisplayProps) {
  const workDuration = useAppStore((s) => s.workDuration);
  const breakDuration = useAppStore((s) => s.breakDuration);
  const setWorkDuration = useAppStore((s) => s.setWorkDuration);
  const setBreakDuration = useAppStore((s) => s.setBreakDuration);
  const setMood = useAppStore((s) => s.setMood);

  const [editingWork, setEditingWork] = useState(false);
  const [editingBreak, setEditingBreak] = useState(false);
  const [tempWork, setTempWork] = useState(workDuration);
  const [tempBreak, setTempBreak] = useState(breakDuration);

  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const openWorkEdit = useCallback(() => {
    if (!isEditable) return;
    setTempWork(workDuration);
    setEditingWork(true);
  }, [isEditable, workDuration]);

  const openBreakEdit = useCallback(() => {
    if (!isEditable) return;
    setTempBreak(breakDuration);
    setEditingBreak(true);
  }, [isEditable, breakDuration]);

  const confirmWork = useCallback(() => {
    setWorkDuration(tempWork);
    setMood(null);
    setEditingWork(false);
  }, [tempWork, setWorkDuration, setMood]);

  const confirmBreak = useCallback(() => {
    setBreakDuration(tempBreak);
    setMood(null);
    setEditingBreak(false);
  }, [tempBreak, setBreakDuration, setMood]);

  return (
    <Box textAlign="center">
      {/* Time display / inline stepper */}
      {editingWork ? (
        <HStack gap="1" justify="center" align="center">
          <InlineStepper
            value={tempWork}
            min={5}
            max={60}
            onChange={setTempWork}
            onDone={confirmWork}
            label="focus minutes"
          />
          <Text fontSize="timer" fontWeight="light" color="fg" fontFamily="mono" opacity={0.3} lineHeight="1">
            :
          </Text>
          <Text fontSize="timer" fontWeight="light" color="fg" fontFamily="mono" opacity={0.3} lineHeight="1">
            00
          </Text>
        </HStack>
      ) : (
        <div role="timer" aria-live="polite" aria-atomic="true">
          <Text
            fontSize="timer"
            fontWeight="light"
            color="fg"
            fontFamily="mono"
            letterSpacing="0.08em"
            lineHeight="1"
            opacity={0.9}
            onClick={isEditable ? openWorkEdit : undefined}
            cursor={isEditable ? "pointer" : "default"}
            transition="opacity 0.15s"
            _hover={isEditable ? { opacity: 1 } : {}}
          >
            {timeStr}
          </Text>
        </div>
      )}

      {/* Label / break duration */}
      {editingBreak ? (
        <HStack gap="1" justify="center" align="center" mt="3">
          <InlineStepper
            value={tempBreak}
            min={1}
            max={30}
            onChange={setTempBreak}
            onDone={confirmBreak}
            fontSize="sm"
            label="break minutes"
          />
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="0.2em" opacity={0.7}>
            min break
          </Text>
        </HStack>
      ) : (
        <Text
          fontSize="xs"
          fontWeight="medium"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.25em"
          mt="3"
          opacity={0.7}
          onClick={isEditable ? openBreakEdit : undefined}
          cursor={isEditable ? "pointer" : "default"}
          transition="opacity 0.15s"
          _hover={isEditable ? { opacity: 1 } : {}}
        >
          {isEditable ? `${breakDuration} min break` : label}
        </Text>
      )}
    </Box>
  );
}
