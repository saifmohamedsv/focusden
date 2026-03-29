"use client";

import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { SpaceBackground } from "@/components/spaces/SpaceBackground";
import { SpaceGrid } from "@/components/spaces/SpaceGrid";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { PomodoroRing } from "@/components/timer/PomodoroRing";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { TimerControls } from "@/components/timer/TimerControls";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { TodoList } from "@/components/todos/TodoList";
import { ProjectNameInput } from "@/components/session/ProjectNameInput";
import { SoundMixer } from "@/components/sounds/SoundMixer";
import { CompanionBear } from "@/components/companion/CompanionBear";
import { useTimer } from "@/hooks/useTimer";
import { useAppStore } from "@/store";
import { getSpaceById } from "@/lib/supabase/spaces";

function FocusWorkspace() {
  const { minutes, seconds, progress, timerStatus, currentRound } = useTimer();
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const activeSpace = getSpaceById(activeSpaceId);
  const isBreak = timerStatus === "break";
  const timerLabel = isBreak ? "Break" : "Focus";

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px="8"
      py="5"
    >
      {/* Top bar: Space name + Mood picker — separated from timer */}
      <VStack gap="3" mb="6" w="full" align="center">
        {/* Space indicator */}
        <HStack gap="2" align="center">
          <Box w="7px" h="7px" borderRadius="full" bg="sage.300" />
          <Text fontSize="sm" fontWeight="medium" color="fg.secondary">
            {activeSpace?.name ?? "Rainy Library"}
          </Text>
          {activeSpace?.category && (
            <>
              <Text fontSize="sm" color="fg.dim">·</Text>
              <Text fontSize="sm" color="fg.dim" textTransform="capitalize">
                {activeSpace.category}
              </Text>
            </>
          )}
        </HStack>

        {/* Mood picker — visually separate from timer zone */}
        <MoodPicker />
      </VStack>

      {/* Timer zone — the cozy center of the experience */}
      <VStack
        flex="1"
        justify="center"
        gap="5"
        minH="0"
      >
        {/* Pomodoro ring with timer display centered inside */}
        <Box
          position="relative"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          <PomodoroRing progress={progress} isBreak={isBreak} />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            style={{ transform: "translate(-50%, -50%)" }}
            textAlign="center"
          >
            <TimerDisplay minutes={minutes} seconds={seconds} label={timerLabel} />
          </Box>
        </Box>

        {/* Round dots indicator */}
        <HStack gap="2" justify="center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Box
              key={i}
              w="8px"
              h="8px"
              borderRadius="full"
              bg={i < currentRound ? "accent" : "rgba(255,255,255,0.1)"}
              transition="background 0.3s ease"
            />
          ))}
        </HStack>

        {/* Timer controls */}
        <TimerControls />

        {/* Project name — subtle, below controls */}
        <Box w="100%" maxW="240px" textAlign="center" opacity={0.7} _hover={{ opacity: 1 }} transition="opacity 0.2s">
          <ProjectNameInput />
        </Box>
      </VStack>

      {/* Notes + Todos at bottom */}
      <HStack
        gap="4"
        w="100%"
        maxW="700px"
        align="stretch"
        minH="0"
        maxH="200px"
        pb="2"
      >
        <NotesPanel />
        <TodoList />
      </HStack>
    </Box>
  );
}

function RightPanelContent() {
  return (
    <>
      {/* Companion bear */}
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border"
        borderRadius="xl"
        p="4"
      >
        <CompanionBear />
      </Box>

      {/* Sound mixer */}
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border"
        borderRadius="xl"
        p="4"
      >
        <SoundMixer />
      </Box>

      {/* Space grid */}
      <SpaceGrid />
    </>
  );
}

export default function DashboardPage() {
  return (
    <>
      <SpaceBackground />
      <WorkspaceLayout rightPanel={<RightPanelContent />}>
        <FocusWorkspace />
      </WorkspaceLayout>
    </>
  );
}
