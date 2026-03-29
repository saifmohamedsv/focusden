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
  const { minutes, seconds, progress, timerStatus } = useTimer();
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
      justifyContent="center"
      px="8"
      py="6"
      gap="6"
    >
      {/* Space name + status */}
      <HStack gap="2" align="center">
        <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
        <Text fontSize="sm" fontWeight="medium" color="fg.secondary">
          {activeSpace?.name ?? "Rainy Library"}
        </Text>
      </HStack>

      {/* Mood picker */}
      <MoodPicker />

      {/* Pomodoro ring with timer display centered inside */}
      <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
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

      {/* Project name input */}
      <Box w="100%" maxW="280px" textAlign="center">
        <ProjectNameInput />
      </Box>

      {/* Timer controls */}
      <TimerControls />

      {/* Notes + Todos at bottom */}
      <HStack
        gap="4"
        w="100%"
        maxW="700px"
        align="stretch"
        flex="1"
        minH="0"
        maxH="240px"
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
