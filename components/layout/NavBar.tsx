"use client";

import { Box, IconButton, Spacer, VStack, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useUser } from "@/lib/auth/user-context";

type BtnVariant = "ghost" | "solid";
type BtnSize = "sm" | "md" | "lg";

function TimerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function SpacesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

export function NavBar() {
  const user = useUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Box
      w="64px"
      h="100vh"
      bg="bg.panel"
      borderRight="1px solid"
      borderColor="border"
      display="flex"
      flexDirection="column"
      alignItems="center"
      py="4"
      gap="2"
    >
      {/* Logo */}
      <Box mb="4">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="accent"
          fontFamily="heading"
          lineHeight="1"
          userSelect="none"
        >
          F
        </Text>
      </Box>

      {/* Nav icon buttons */}
      <VStack gap="1">
        <IconButton
          aria-label="Timer"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
        >
          <TimerIcon />
        </IconButton>
        <IconButton
          aria-label="Spaces"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
        >
          <SpacesIcon />
        </IconButton>
        <IconButton
          aria-label="Notes"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
        >
          <NotesIcon />
        </IconButton>
      </VStack>

      <Spacer />

      {/* Bottom section */}
      <VStack gap="3" alignItems="center">
        <IconButton
          aria-label="Settings"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
        >
          <SettingsIcon />
        </IconButton>

        {/* Avatar circle */}
        <Box
          w="36px"
          h="36px"
          borderRadius="full"
          bg="bg.surface"
          border="2px solid"
          borderColor="yellow.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          overflow="hidden"
          onClick={() => signOut()}
          title="Sign out"
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User avatar"}
              width={36}
              height={36}
              style={{ borderRadius: "50%", display: "block" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <Text fontSize="xs" fontWeight="bold" color="fg" userSelect="none">
              {initials}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
