"use client";
import { Box, Text } from "@chakra-ui/react";
import { useHydration } from "@/hooks/useHydration";
import { UserProvider } from "@/lib/auth/user-context";

interface Props {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function HydrationGuard({ children, user }: Props) {
  const hasHydrated = useHydration();
  const userInfo = user
    ? {
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
      }
    : null;

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

  return <UserProvider user={userInfo}>{children}</UserProvider>;
}
