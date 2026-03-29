"use client";

import { Box, IconButton, Spacer, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";
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

function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
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

/** Panels icon — used in mobile bottom bar to open right-panel drawer */
function PanelsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

interface NavBarProps {
  onDrawerToggle?: () => void;
}

export function NavBar({ onDrawerToggle }: NavBarProps) {
  const user = useUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const avatarNode = (
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
      flexShrink={0}
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
  );

  return (
    <>
      {/* ─── Desktop / Tablet vertical sidebar (shown ≥768px) ─── */}
      <Box
        as="nav"
        aria-label="Main navigation"
        className="navbar-sidebar"
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
          <Link href="/stats" style={{ display: "contents" }}>
            <IconButton
              aria-label="Stats"
              variant={"ghost" as BtnVariant}
              size={"md" as BtnSize}
              rounded="xl"
              color="fg.secondary"
            >
              <BarChartIcon />
            </IconButton>
          </Link>
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

          {avatarNode}
        </VStack>
      </Box>

      {/* ─── Mobile horizontal bottom bar (shown <768px) ─── */}
      <Box
        as="nav"
        aria-label="Mobile navigation"
        className="navbar-bottom"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        h="56px"
        bg="bg.panel"
        borderTop="1px solid"
        borderColor="border"
        display="none"
        alignItems="center"
        justifyContent="space-around"
        px="2"
        zIndex={50}
      >
        {/* Timer (home) */}
        <IconButton
          aria-label="Timer"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
          minW="44px"
          minH="44px"
        >
          <TimerIcon />
        </IconButton>

        {/* Spaces */}
        <IconButton
          aria-label="Spaces"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
          minW="44px"
          minH="44px"
        >
          <SpacesIcon />
        </IconButton>

        {/* Stats */}
        <Link href="/stats">
          <IconButton
            aria-label="Stats"
            variant={"ghost" as BtnVariant}
            size={"md" as BtnSize}
            rounded="xl"
            color="fg.secondary"
            minW="44px"
            minH="44px"
          >
            <BarChartIcon />
          </IconButton>
        </Link>

        {/* Panels — opens right panel drawer */}
        <IconButton
          aria-label="Open panels"
          variant={"ghost" as BtnVariant}
          size={"md" as BtnSize}
          rounded="xl"
          color="fg.secondary"
          minW="44px"
          minH="44px"
          onClick={onDrawerToggle}
        >
          <PanelsIcon />
        </IconButton>

        {/* Avatar */}
        {avatarNode}
      </Box>
    </>
  );
}
