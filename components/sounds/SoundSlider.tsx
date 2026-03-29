"use client";

import { HStack, Text, Box } from "@chakra-ui/react";
import { SoundTrack } from "@/types";

interface SoundSliderProps {
  track: SoundTrack;
  onVolumeChange: (id: string, volume: number) => void;
  onToggle: (id: string) => void;
}

export function SoundSlider({ track, onVolumeChange, onToggle }: SoundSliderProps) {
  return (
    <HStack gap="3" w="full" align="center">
      <Text fontSize="md" flexShrink={0} w="24px" textAlign="center">
        {track.icon}
      </Text>
      <Text fontSize="sm" color="fg.secondary" w="50px" flexShrink={0}>
        {track.name}
      </Text>
      <Box flex="1" display="flex" alignItems="center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={track.volume}
          onChange={(e) => onVolumeChange(track.id, parseFloat(e.target.value))}
          style={{
            width: "100%",
            height: "4px",
            appearance: "none",
            WebkitAppearance: "none",
            background: `linear-gradient(to right, var(--color-accent) ${track.volume * 100}%, var(--color-surface) ${track.volume * 100}%)`,
            borderRadius: "9999px",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </Box>
      <Box
        as="button"
        onClick={() => onToggle(track.id)}
        w="10px"
        h="10px"
        borderRadius="full"
        bg={track.enabled && track.volume > 0 ? "accent" : "bg.elevated"}
        border="1px solid"
        borderColor={track.enabled && track.volume > 0 ? "accent" : "border.mid"}
        cursor="pointer"
        flexShrink={0}
        transition="all 0.2s"
      />
    </HStack>
  );
}
