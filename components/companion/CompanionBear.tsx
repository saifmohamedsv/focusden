"use client";

import { VStack, Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/store";
import { useIdle } from "@/hooks/useIdle";
import { BearWorking } from "./BearWorking";
import { BearCelebrating } from "./BearCelebrating";
import { BearIdle } from "./BearIdle";
import { BearStretching } from "./BearStretching";
import { SpeechBubble } from "./SpeechBubble";
import { CompanionState } from "@/types";

const bearComponents: Record<CompanionState, React.ComponentType> = {
  working: BearWorking,
  celebrating: BearCelebrating,
  idle: BearIdle,
  stretching: BearStretching,
};

export function CompanionBear() {
  const companionState = useAppStore((s) => s.companionState);
  const setCompanionState = useAppStore((s) => s.setCompanionState);
  const timerStatus = useAppStore((s) => s.timerStatus);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTimerStatus = useRef(timerStatus);

  useEffect(() => {
    if (timerStatus === "transition_to_break") {
      // Work session just ended — celebrate!
      setCompanionState("celebrating");
      celebrationTimer.current = setTimeout(() => {
        setCompanionState("stretching");
      }, 3000);
    } else if (timerStatus === "running") {
      setCompanionState("working");
    } else if (timerStatus === "break" || timerStatus === "transition_to_focus") {
      setCompanionState("stretching");
    } else if (timerStatus === "idle" || timerStatus === "paused") {
      if (companionState !== "celebrating") {
        setCompanionState("idle");
      }
    }

    prevTimerStatus.current = timerStatus;

    return () => {
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    };
  }, [timerStatus, setCompanionState, companionState]);

  const handleIdle = useCallback(() => {
    if (timerStatus !== "running" && timerStatus !== "break") {
      setCompanionState("idle");
    }
  }, [timerStatus, setCompanionState]);

  const handleActive = useCallback(() => {
    if (timerStatus === "running") {
      setCompanionState("working");
    }
  }, [timerStatus, setCompanionState]);

  useIdle(5 * 60 * 1000, handleIdle, handleActive);

  const BearComponent = bearComponents[companionState];
  const prefersReduced = useReducedMotion();
  const bearDuration = prefersReduced ? 0 : 0.3;

  return (
    <VStack gap="2" w="full" align="center">
      <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">
        Your Buddy
      </Text>
      <SpeechBubble state={companionState} />
      <Box w="full" maxW="200px" mx="auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={companionState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: bearDuration }}
          >
            <BearComponent />
          </motion.div>
        </AnimatePresence>
      </Box>
    </VStack>
  );
}
