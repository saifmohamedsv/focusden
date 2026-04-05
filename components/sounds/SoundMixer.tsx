"use client";

import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { useAudio } from "@/hooks/useAudio";
import { SoundSlider } from "./SoundSlider";

function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export function SoundMixer() {
  const { soundTracks, masterVolume, updateVolume, toggle, updateMasterVolume } = useAudio();

  return (
    <VStack gap="3" w="full" align="start">
      <HStack w="full" justify="space-between" align="center">
        <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">
          Ambient Sounds
        </Text>
        <HStack gap="2" align="center" color="fg.dim">
          <SpeakerIcon />
          <Box display="flex" alignItems="center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => updateMasterVolume(parseFloat(e.target.value))}
              aria-label="Master volume"
              aria-valuetext={`${Math.round(masterVolume * 100)}%`}
              style={{
                width: "60px",
                height: "3px",
                appearance: "none",
                WebkitAppearance: "none",
                background: `linear-gradient(to right, var(--color-fg-dim) ${masterVolume * 100}%, var(--color-surface) ${masterVolume * 100}%)`,
                borderRadius: "9999px",
                outline: "none",
                cursor: "pointer",
              }}
            />
          </Box>
        </HStack>
      </HStack>
      {soundTracks.map((track) => (
        <SoundSlider key={track.id} track={track} onVolumeChange={updateVolume} onToggle={toggle} />
      ))}
    </VStack>
  );
}
