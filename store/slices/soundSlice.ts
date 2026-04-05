import { StateCreator } from "zustand";
import { SoundTrack } from "@/types";

export interface SoundSlice {
  soundTracks: SoundTrack[];
  masterVolume: number;
  setTrackVolume: (id: string, volume: number) => void;
  toggleTrack: (id: string) => void;
  setMasterVolume: (volume: number) => void;
  setSoundTracks: (tracks: SoundTrack[]) => void;
}

const defaultTracks: SoundTrack[] = [
  { id: "rain", name: "Rain", icon: "\uD83C\uDF27\uFE0F", sources: ["/sounds/rain.m4a", "/sounds/rain.ogg"], volume: 0, enabled: false },
  { id: "waves", name: "Waves", icon: "\uD83C\uDF0A", sources: ["/sounds/waves.m4a", "/sounds/waves.ogg"], volume: 0, enabled: false },
  { id: "cafe", name: "Cafe", icon: "\u2615", sources: ["/sounds/cafe.m4a", "/sounds/cafe.ogg"], volume: 0, enabled: false },
  { id: "fire", name: "Fire", icon: "\uD83D\uDD25", sources: ["/sounds/fire.m4a", "/sounds/fire.ogg"], volume: 0, enabled: false },
  { id: "forest", name: "Forest", icon: "\uD83C\uDF3F", sources: ["/sounds/forest.m4a", "/sounds/forest.ogg"], volume: 0, enabled: false },
  { id: "delta", name: "Delta", icon: "\uD83E\uDDE0", sources: ["/sounds/delta.m4a", "/sounds/delta.ogg"], volume: 0, enabled: false },
];

export const createSoundSlice: StateCreator<SoundSlice, [], [], SoundSlice> = (set) => ({
  soundTracks: defaultTracks,
  masterVolume: 0.5,
  setTrackVolume: (id, volume) =>
    set((state) => ({
      soundTracks: state.soundTracks.map((t) =>
        t.id === id ? { ...t, volume, enabled: volume > 0 } : t,
      ),
    })),
  toggleTrack: (id) =>
    set((state) => ({
      soundTracks: state.soundTracks.map((t) =>
        t.id === id ? { ...t, enabled: !t.enabled } : t,
      ),
    })),
  setMasterVolume: (volume) => set({ masterVolume: volume }),
  setSoundTracks: (tracks) => set({ soundTracks: tracks }),
});
