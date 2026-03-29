import { StateCreator } from "zustand";
import { SoundTrack } from "@/types";

export interface SoundSlice {
  soundTracks: SoundTrack[];
  setTrackVolume: (id: string, volume: number) => void;
  toggleTrack: (id: string) => void;
  setSoundTracks: (tracks: SoundTrack[]) => void;
}

const defaultTracks: SoundTrack[] = [
  { id: "rain", name: "Rain", icon: "\uD83C\uDF27\uFE0F", file: "/sounds/rain.mp3", volume: 0, enabled: false },
  { id: "waves", name: "Waves", icon: "\uD83C\uDF0A", file: "/sounds/waves.mp3", volume: 0, enabled: false },
  { id: "cafe", name: "Cafe", icon: "\u2615", file: "/sounds/cafe.mp3", volume: 0, enabled: false },
  { id: "fire", name: "Fire", icon: "\uD83D\uDD25", file: "/sounds/fire.mp3", volume: 0, enabled: false },
  { id: "forest", name: "Forest", icon: "\uD83C\uDF3F", file: "/sounds/forest.mp3", volume: 0, enabled: false },
  { id: "delta", name: "Delta", icon: "\uD83E\uDDE0", file: "/sounds/delta.mp3", volume: 0, enabled: false },
];

export const createSoundSlice: StateCreator<SoundSlice, [], [], SoundSlice> = (set) => ({
  soundTracks: defaultTracks,
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
  setSoundTracks: (tracks) => set({ soundTracks: tracks }),
});
