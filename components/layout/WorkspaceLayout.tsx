"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavBar } from "./NavBar";
import { RightPanel } from "./RightPanel";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

interface RightPanelDrawerProps {
  onClose: () => void;
  children: React.ReactNode;
}

function RightPanelDrawer({ onClose, children }: RightPanelDrawerProps) {
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
      zIndex={100}
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <Box
        bg="bg.panel"
        border="1px solid"
        borderColor="border"
        borderTopRadius="2xl"
        boxShadow="0 -8px 40px rgba(0,0,0,0.5)"
        maxH="80vh"
        w="100%"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideUpDrawer 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Drag handle */}
        <Box
          display="flex"
          justifyContent="center"
          pt="3"
          pb="1"
          flexShrink={0}
          cursor="pointer"
          onClick={onClose}
        >
          <Box w="32px" h="4px" borderRadius="full" bg="border" opacity={0.6} />
        </Box>

        {/* Content */}
        <Box
          flex="1"
          overflow="auto"
          p="4"
          css={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
        >
          {children}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}

export function WorkspaceLayout({ children, rightPanel }: WorkspaceLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes slideUpDrawer {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <Box h="100vh" overflow="hidden" display="flex" flexDirection="column">
        {/* Top bar */}
        <NavBar onDrawerToggle={() => setDrawerOpen((o) => !o)} />

        {/* Content area */}
        <Box flex="1" display="flex" overflow="hidden" minH="0">
          {/* Main workspace */}
          <Box as="main" flex="1" overflow="hidden" position="relative">
            <Box
              h="100%"
              overflow="auto"
              css={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
            >
              {children}
            </Box>
          </Box>

          {/* Right panel — hidden on tablet/mobile via CSS */}
          <Box className="workspace-right" flexShrink={0}>
            <RightPanel>{rightPanel}</RightPanel>
          </Box>
        </Box>
      </Box>

      {/* Drawer for tablet/mobile */}
      {drawerOpen && rightPanel && (
        <RightPanelDrawer onClose={() => setDrawerOpen(false)}>
          {rightPanel}
        </RightPanelDrawer>
      )}
    </>
  );
}
