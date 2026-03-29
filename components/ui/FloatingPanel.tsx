"use client";

import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FloatingPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function FloatingPanel({ title, onClose, children }: FloatingPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <Box
      position="fixed"
      inset="0"
      zIndex={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <Box
        bg="bg.panel"
        border="1px solid"
        borderColor="border"
        borderRadius="2xl"
        boxShadow="0 24px 64px rgba(0,0,0,0.5)"
        maxW="560px"
        w="calc(100vw - 2rem)"
        maxH="70vh"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px="5"
          py="4"
          borderBottom="1px solid"
          borderColor="border"
          flexShrink={0}
        >
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="fg.muted"
            textTransform="uppercase"
            letterSpacing="0.15em"
          >
            {title}
          </Text>
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              fontSize: "1.25rem",
              lineHeight: 1,
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.6"; }}
          >
            ×
          </button>
        </Box>

        {/* Content */}
        <Box flex="1" overflow="auto" p="5" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
          {children}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
