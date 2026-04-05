import { StateCreator } from "zustand";

export interface SessionSlice {
  projectName: string;
  sessionStartedAt: number | null;
  setProjectName: (name: string) => void;
  startSession: () => void;
  endSession: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  projectName: "",
  sessionStartedAt: null,
  setProjectName: (name) => set({ projectName: name }),
  startSession: () => set({ sessionStartedAt: Date.now() }),
  endSession: () => set({ sessionStartedAt: null }),
});
