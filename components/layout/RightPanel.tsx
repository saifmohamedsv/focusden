"use client";

import { Box, VStack } from "@chakra-ui/react";

interface RightPanelProps {
  children: React.ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <Box
      as="aside"
      w="320px"
      h="100%"
      bg="bg.panel"
      borderLeft="1px solid"
      borderColor="border"
      overflow="auto"
      css={{ "&::-webkit-scrollbar": { display: "none" }, "scrollbarWidth": "none" }}
    >
      <VStack py="4" px="4" gap="4" align="stretch">
        {children}
      </VStack>
    </Box>
  );
}
