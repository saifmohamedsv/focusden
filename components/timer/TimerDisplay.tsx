"use client";

import { useState, useRef, useCallback } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useAppStore } from "@/store";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  label: string;
  isEditable?: boolean;
}

export function TimerDisplay({ minutes, seconds, label, isEditable = false }: TimerDisplayProps) {
  const workDuration = useAppStore((s) => s.workDuration);
  const breakDuration = useAppStore((s) => s.breakDuration);
  const setWorkDuration = useAppStore((s) => s.setWorkDuration);
  const setBreakDuration = useAppStore((s) => s.setBreakDuration);
  const setMood = useAppStore((s) => s.setMood);

  const [editingWork, setEditingWork] = useState(false);
  const [editingBreak, setEditingBreak] = useState(false);
  const [workInput, setWorkInput] = useState("");
  const [breakInput, setBreakInput] = useState("");

  const workInputRef = useRef<HTMLInputElement>(null);
  const breakInputRef = useRef<HTMLInputElement>(null);

  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const openWorkEdit = useCallback(() => {
    if (!isEditable) return;
    setWorkInput(String(workDuration));
    setEditingWork(true);
    setTimeout(() => {
      workInputRef.current?.select();
    }, 0);
  }, [isEditable, workDuration]);

  const openBreakEdit = useCallback(() => {
    if (!isEditable) return;
    setBreakInput(String(breakDuration));
    setEditingBreak(true);
    setTimeout(() => {
      breakInputRef.current?.select();
    }, 0);
  }, [isEditable, breakDuration]);

  const confirmWork = useCallback(() => {
    const val = parseInt(workInput, 10);
    if (!isNaN(val) && val >= 5 && val <= 60) {
      setWorkDuration(val);
      setMood(null);
    }
    setEditingWork(false);
  }, [workInput, setWorkDuration, setMood]);

  const confirmBreak = useCallback(() => {
    const val = parseInt(breakInput, 10);
    if (!isNaN(val) && val >= 1 && val <= 30) {
      setBreakDuration(val);
      setMood(null);
    }
    setEditingBreak(false);
  }, [breakInput, setBreakDuration, setMood]);

  const cancelWork = useCallback(() => setEditingWork(false), []);
  const cancelBreak = useCallback(() => setEditingBreak(false), []);

  return (
    <Box textAlign="center">
      {/* Time digits — click to edit work duration when editable */}
      {editingWork ? (
        <input
          ref={workInputRef}
          type="number"
          min={5}
          max={60}
          value={workInput}
          onChange={(e) => setWorkInput(e.target.value)}
          onBlur={confirmWork}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmWork();
            if (e.key === "Escape") cancelWork();
          }}
          autoFocus
          style={{
            fontSize: "clamp(3rem, 8vw, 5rem)",
            fontWeight: 300,
            fontFamily: "var(--font-mono, monospace)",
            letterSpacing: "0.08em",
            lineHeight: 1,
            color: "var(--color-text-primary)",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid var(--color-accent)",
            outline: "none",
            textAlign: "center",
            width: "5ch",
            opacity: 0.9,
            padding: "0 4px",
          }}
        />
      ) : (
        <Text
          fontSize="timer"
          fontWeight="light"
          color="fg"
          fontFamily="mono"
          letterSpacing="0.08em"
          lineHeight="1"
          opacity={0.9}
          onClick={isEditable ? openWorkEdit : undefined}
          cursor={isEditable ? "text" : "default"}
          style={
            isEditable
              ? {
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  textDecorationColor: "transparent",
                  transition: "text-decoration-color 0.2s",
                }
              : undefined
          }
          onMouseEnter={
            isEditable
              ? (e) => {
                  (e.currentTarget as HTMLElement).style.textDecorationColor =
                    "var(--color-accent)";
                }
              : undefined
          }
          onMouseLeave={
            isEditable
              ? (e) => {
                  (e.currentTarget as HTMLElement).style.textDecorationColor = "transparent";
                }
              : undefined
          }
        >
          {timeStr}
        </Text>
      )}

      {/* Break label / break duration edit */}
      {editingBreak ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            marginTop: "12px",
          }}
        >
          <input
            ref={breakInputRef}
            type="number"
            min={1}
            max={30}
            value={breakInput}
            onChange={(e) => setBreakInput(e.target.value)}
            onBlur={confirmBreak}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmBreak();
              if (e.key === "Escape") cancelBreak();
            }}
            autoFocus
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--color-accent)",
              outline: "none",
              textAlign: "center",
              width: "3ch",
              padding: "0 2px",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              opacity: 0.7,
            }}
          >
            min break
          </span>
        </div>
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
          cursor={isEditable ? "text" : "default"}
          style={
            isEditable
              ? {
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  textDecorationColor: "transparent",
                  transition: "text-decoration-color 0.2s",
                }
              : undefined
          }
          onMouseEnter={
            isEditable
              ? (e) => {
                  (e.currentTarget as HTMLElement).style.textDecorationColor =
                    "var(--color-text-secondary)";
                }
              : undefined
          }
          onMouseLeave={
            isEditable
              ? (e) => {
                  (e.currentTarget as HTMLElement).style.textDecorationColor = "transparent";
                }
              : undefined
          }
        >
          {isEditable ? `${breakDuration} min break` : label}
        </Text>
      )}
    </Box>
  );
}
