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
          <Box
            w="32px"
            h="4px"
            borderRadius="full"
            bg="border"
            opacity={0.6}
          />
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
      {/* Inject keyframe for drawer animation */}
      <style>{`
        @keyframes slideUpDrawer {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {/* Desktop + Tablet layout (uses CSS grid that collapses right panel at ≤1023px) */}
      <Box
        className="workspace-grid"
        h="100vh"
        overflow="hidden"
        display="grid"
        /* Desktop: 64px nav | 1fr content | 320px right */
        gridTemplateColumns="64px 1fr 320px"
        gridTemplateRows="1fr"
      >
        {/* Left: NavBar — passes drawer toggle for mobile bottom bar */}
        <Box className="workspace-nav">
          <NavBar onDrawerToggle={() => setDrawerOpen((o) => !o)} />
        </Box>

        {/* Center: main content */}
        <Box as="main" className="workspace-main" overflow="hidden">
          <Box
            h="100%"
            overflow="auto"
            css={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
          >
            {children}
          </Box>
        </Box>

        {/* Right: RightPanel — hidden on tablet/mobile via CSS */}
        <Box className="workspace-right">
          <RightPanel>{rightPanel}</RightPanel>
        </Box>
      </Box>

      {/* Drawer for tablet/mobile — shown when toggled */}
      {drawerOpen && rightPanel && (
        <RightPanelDrawer onClose={() => setDrawerOpen(false)}>
          {rightPanel}
        </RightPanelDrawer>
      )}
    </>
  );
}
