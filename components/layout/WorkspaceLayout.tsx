"use client";

import { Grid, GridItem, Box } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import { RightPanel } from "./RightPanel";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function WorkspaceLayout({ children, rightPanel }: WorkspaceLayoutProps) {
  return (
    <Grid
      templateColumns="64px 1fr 320px"
      h="100vh"
      overflow="hidden"
    >
      {/* Left: NavBar */}
      <GridItem>
        <NavBar />
      </GridItem>

      {/* Center: main content */}
      <GridItem as="main" overflow="hidden">
        <Box h="100%" overflow="auto" css={{ "&::-webkit-scrollbar": { display: "none" }, "scrollbarWidth": "none" }}>
          {children}
        </Box>
      </GridItem>

      {/* Right: RightPanel */}
      <GridItem>
        <RightPanel>
          {rightPanel}
        </RightPanel>
      </GridItem>
    </Grid>
  );
}
