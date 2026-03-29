import { StateCreator } from "zustand";
import { CompanionState } from "@/types";

export interface CompanionSlice {
  companionState: CompanionState;
  setCompanionState: (state: CompanionState) => void;
}

export const createCompanionSlice: StateCreator<CompanionSlice, [], [], CompanionSlice> = (set) => ({
  companionState: "idle",
  setCompanionState: (companionState) => set({ companionState }),
});
