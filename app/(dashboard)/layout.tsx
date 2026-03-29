"use client";

import { Box, Text } from "@chakra-ui/react";
import { useHydration } from "@/hooks/useHydration";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasHydrated = useHydration();

  if (!hasHydrated) {
    return (
      <Box
        minH="100vh"
        bg="bg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="fg.muted" fontSize="sm">
          Loading...
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
}
