"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { useAppStore } from "@/store";

interface HowlMap {
  [trackId: string]: Howl;
}

export function useAudio() {
  const howlsRef = useRef<HowlMap>({});
  const initializedRef = useRef(false);
  const soundTracks = useAppStore((s) => s.soundTracks);
  const setTrackVolume = useAppStore((s) => s.setTrackVolume);
  const toggleTrack = useAppStore((s) => s.toggleTrack);

  // Initialize Howl instances once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const howls: HowlMap = {};
    soundTracks.forEach((track) => {
      howls[track.id] = new Howl({
        src: [track.file],
        loop: true,
        volume: track.volume,
        preload: true,
      });
    });
    howlsRef.current = howls;

    return () => {
      Object.values(howls).forEach((howl) => howl.unload());
      initializedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync play/pause/volume with store state
  useEffect(() => {
    soundTracks.forEach((track) => {
      const howl = howlsRef.current[track.id];
      if (!howl) return;

      howl.volume(track.volume);

      if (track.enabled && track.volume > 0) {
        if (!howl.playing()) howl.play();
      } else {
        if (howl.playing()) howl.pause();
      }
    });
  }, [soundTracks]);

  const updateVolume = useCallback((trackId: string, volume: number) => {
    setTrackVolume(trackId, volume);
  }, [setTrackVolume]);

  const toggle = useCallback((trackId: string) => {
    toggleTrack(trackId);
  }, [toggleTrack]);

  return { soundTracks, updateVolume, toggle };
}
