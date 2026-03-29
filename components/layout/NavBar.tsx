"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useUser } from "@/lib/auth/user-context";

function TimerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      <path d="M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93" />
    </svg>
  );
}

function PanelsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

interface NavBarProps {
  onDrawerToggle?: () => void;
}

function NavButton({
  children,
  label,
  onClick,
  href,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <Box
      as="button"
      onClick={onClick}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="36px"
      h="36px"
      borderRadius="lg"
      color="fg.muted"
      cursor="pointer"
      transition="all 0.15s"
      _hover={{ color: "fg", bg: "bg.surface" }}
      aria-label={label}
      title={label}
    >
      {children}
    </Box>
  );

  if (href) {
    return <Link href={href} style={{ display: "contents" }}>{inner}</Link>;
  }
  return inner;
}

export function NavBar({ onDrawerToggle }: NavBarProps) {
  const user = useUser();

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <Box
      as="nav"
      aria-label="Main navigation"
      w="full"
      h="48px"
      bg="bg.panel"
      borderBottom="1px solid"
      borderColor="border"
      display="flex"
      alignItems="center"
      px="4"
      flexShrink={0}
    >
      {/* Logo — left */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="accent"
          fontFamily="heading"
          lineHeight="1"
          userSelect="none"
          cursor="pointer"
        >
          FocusDen
        </Text>
      </Link>

      {/* Spacer */}
      <Box flex="1" />

      {/* Nav icons — center-right */}
      <HStack gap="1">
        <NavButton label="Timer" href="/">
          <TimerIcon />
        </NavButton>
        <NavButton label="Stats" href="/stats">
          <BarChartIcon />
        </NavButton>
        <NavButton label="Sounds & Spaces" onClick={onDrawerToggle}>
          <PanelsIcon />
        </NavButton>
        <NavButton label="Settings">
          <SettingsIcon />
        </NavButton>
      </HStack>

      {/* Spacer */}
      <Box w="4" />

      {/* Avatar — right */}
      <Box
        w="32px"
        h="32px"
        borderRadius="full"
        bg="bg.surface"
        border="2px solid"
        borderColor="accent"
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
            width={32}
            height={32}
            style={{ borderRadius: "50%", display: "block" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <Text fontSize="xs" fontWeight="bold" color="accent" userSelect="none">
            {initials}
          </Text>
        )}
      </Box>
    </Box>
  );
}
