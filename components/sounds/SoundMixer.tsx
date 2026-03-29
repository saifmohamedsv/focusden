"use client";

import { VStack, Text } from "@chakra-ui/react";
import { useAudio } from "@/hooks/useAudio";
import { SoundSlider } from "./SoundSlider";

export function SoundMixer() {
  const { soundTracks, updateVolume, toggle } = useAudio();

  return (
    <VStack gap="3" w="full" align="start">
      <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">
        Ambient Sounds
      </Text>
      {soundTracks.map((track) => (
        <SoundSlider key={track.id} track={track} onVolumeChange={updateVolume} onToggle={toggle} />
      ))}
    </VStack>
  );
}
