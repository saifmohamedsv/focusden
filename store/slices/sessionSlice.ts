import { StateCreator } from "zustand";
import { Mood } from "@/types";

export interface SessionSlice {
  mood: Mood | null;
  projectName: string;
  sessionStartedAt: number | null;
  setMood: (mood: Mood | null) => void;
  setProjectName: (name: string) => void;
  startSession: () => void;
  endSession: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  mood: null,
  projectName: "",
  sessionStartedAt: null,
  setMood: (mood) => set({ mood }),
  setProjectName: (name) => set({ projectName: name }),
  startSession: () => set({ sessionStartedAt: Date.now() }),
  endSession: () => set({ sessionStartedAt: null }),
});
