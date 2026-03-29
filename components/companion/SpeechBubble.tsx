"use client";

import { Box, Text } from "@chakra-ui/react";
import { CompanionState } from "@/types";

const stateMessages: Record<CompanionState, string> = {
  working: "working hard",
  celebrating: "nice job!",
  idle: "still there?",
  stretching: "stretch break",
};

interface SpeechBubbleProps {
  state: CompanionState;
}

export function SpeechBubble({ state }: SpeechBubbleProps) {
  return (
    <Box
      bg="success.soft"
      border="1px solid"
      borderColor="success.dim"
      borderRadius="full"
      px="3"
      py="1"
      display="inline-flex"
      alignItems="center"
      gap="1.5"
    >
      <Box w="6px" h="6px" borderRadius="full" bg="success" />
      <Text fontSize="xs" color="success" fontWeight="medium">
        {stateMessages[state]}
      </Text>
    </Box>
  );
}
