"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl, Howler } from "howler";
import { useAppStore } from "@/store";

const FADE_MS = 80;

interface HowlMap {
  [trackId: string]: Howl;
}

/**
 * Get or lazily create a Howl instance for a track.
 * Instances are only created when first needed (first play).
 */
function getOrCreateHowl(
  howls: HowlMap,
  trackId: string,
  sources: string[],
  volume: number,
): Howl {
  if (howls[trackId]) return howls[trackId];

  const howl = new Howl({
    src: sources,
    loop: true,
    volume,
    html5: false, // Web Audio mode — gapless loops, precise volume
    preload: true,
  });
  howls[trackId] = howl;
  return howl;
}

export function useAudio() {
  const howlsRef = useRef<HowlMap>({});
  const soundTracks = useAppStore((s) => s.soundTracks);
  const masterVolume = useAppStore((s) => s.masterVolume);
  const setTrackVolume = useAppStore((s) => s.setTrackVolume);
  const toggleTrack = useAppStore((s) => s.toggleTrack);
  const setMasterVolume = useAppStore((s) => s.setMasterVolume);

  // Sync master volume to Howler global
  useEffect(() => {
    Howler.volume(masterVolume);
  }, [masterVolume]);

  // Sync play/pause/volume with store state
  useEffect(() => {
    soundTracks.forEach((track) => {
      const shouldPlay = track.enabled && track.volume > 0;

      if (!shouldPlay) {
        // Only touch the Howl if it was already created
        const howl = howlsRef.current[track.id];
        if (howl && howl.playing()) {
          howl.fade(howl.volume(), 0, FADE_MS);
          setTimeout(() => howl.pause(), FADE_MS);
        }
        return;
      }

      // Lazy-create the Howl on first play
      const howl = getOrCreateHowl(
        howlsRef.current,
        track.id,
        track.sources,
        track.volume,
      );

      // Fade to new volume (prevents clicks on slider drag)
      const currentVol = howl.volume();
      if (Math.abs(currentVol - track.volume) > 0.005) {
        howl.fade(currentVol, track.volume, FADE_MS);
      }

      if (!howl.playing()) {
        howl.volume(0);
        howl.play();
        howl.fade(0, track.volume, FADE_MS * 2);
      }
    });
  }, [soundTracks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(howlsRef.current).forEach((howl) => howl.unload());
      howlsRef.current = {};
    };
  }, []);

  const updateVolume = useCallback((trackId: string, volume: number) => {
    setTrackVolume(trackId, volume);
  }, [setTrackVolume]);

  const toggle = useCallback((trackId: string) => {
    toggleTrack(trackId);
  }, [toggleTrack]);

  const updateMasterVolume = useCallback((volume: number) => {
    setMasterVolume(volume);
  }, [setMasterVolume]);

  return { soundTracks, masterVolume, updateVolume, toggle, updateMasterVolume };
}
