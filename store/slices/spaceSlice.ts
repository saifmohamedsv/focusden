import { StateCreator } from "zustand";

export interface SpaceSlice {
  activeSpaceId: string;
  setActiveSpace: (id: string) => void;
}

export const createSpaceSlice: StateCreator<SpaceSlice, [], [], SpaceSlice> = (set) => ({
  activeSpaceId: "a1b2c3d4-0001-4000-8000-000000000001",
  setActiveSpace: (id) => set({ activeSpaceId: id }),
});
