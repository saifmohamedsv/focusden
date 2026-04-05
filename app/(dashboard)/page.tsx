"use client";

import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { SpaceBackground } from "@/components/spaces/SpaceBackground";
import { SpaceGrid } from "@/components/spaces/SpaceGrid";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { PomodoroRing } from "@/components/timer/PomodoroRing";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { TimerControls } from "@/components/timer/TimerControls";
import { TransitionCard } from "@/components/timer/TransitionCard";
import { NotesDock } from "@/components/notes/NotesDock";
import { TodosDock } from "@/components/todos/TodosDock";
import { ProjectNameInput } from "@/components/session/ProjectNameInput";
import { QuickStart } from "@/components/session/QuickStart";
import { SoundMixer } from "@/components/sounds/SoundMixer";
import { CompanionBear } from "@/components/companion/CompanionBear";
import { useTimer } from "@/hooks/useTimer";
import { useAppStore } from "@/store";
import { getSpaceById } from "@/lib/supabase/spaces";

function FocusWorkspace() {
  const { minutes, seconds, progress, timerStatus, currentRound, lastFocusDuration, isTransition, timerPhase } = useTimer();
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const todos = useAppStore((s) => s.todos);
  const activeSpace = getSpaceById(activeSpaceId);
  const isBreak = timerPhase === "break";
  const timerLabel = isBreak ? "Break" : "Focus";
  const todosCompletedCount = todos.filter((t) => t.completed).length;

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={{ base: "4", md: "8" }}
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

      </VStack>

      {/* Timer zone — the cozy center of the experience */}
      <VStack
        flex="1"
        justify="center"
        gap="5"
        minH="0"
      >
        {isTransition ? (
          <TransitionCard
            mode={timerStatus === "transition_to_break" ? "focus_complete" : "break_complete"}
            lastFocusDuration={lastFocusDuration}
            todosCompletedCount={todosCompletedCount}
          />
        ) : (
          <>
            {/* Pomodoro ring with timer display centered inside.
                On mobile use a smaller ring (220px) via CSS class. */}
            <Box
              className="timer-ring-wrapper"
              position="relative"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* Desktop ring (hidden on mobile) */}
              <Box className="timer-ring-desktop">
                <PomodoroRing progress={progress} isBreak={isBreak} size={300} />
              </Box>
              {/* Mobile ring (hidden on desktop) */}
              <Box className="timer-ring-mobile">
                <PomodoroRing progress={progress} isBreak={isBreak} size={220} />
              </Box>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                style={{ transform: "translate(-50%, -50%)" }}
                textAlign="center"
              >
                <TimerDisplay
                  minutes={minutes}
                  seconds={seconds}
                  label={timerLabel}
                  isEditable={timerStatus === "idle"}
                />
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

            {/* Quick start — only when idle */}
            {timerStatus === "idle" && <QuickStart />}

            {/* Project name — subtle, below controls */}
            <Box w="100%" maxW="240px" textAlign="center" opacity={0.7} _hover={{ opacity: 1 }} transition="opacity 0.2s">
              <ProjectNameInput />
            </Box>
          </>
        )}
      </VStack>

      {/* Notes + Todos dock — small icon bar at bottom.
          On mobile, shift up by 56px to clear the bottom nav bar. */}
      <HStack
        gap="2"
        position="absolute"
        className="notes-dock"
        bottom="5"
        left="50%"
        style={{ transform: "translateX(-50%)" }}
        bg="bg.panel"
        border="1px solid"
        borderColor="border"
        borderRadius="full"
        px="3"
        py="2"
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.4)"
      >
        <NotesDock />
        <TodosDock />
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
