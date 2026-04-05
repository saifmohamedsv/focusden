"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";
import { createTimerSlice, TimerSlice } from "./slices/timerSlice";
import { createSpaceSlice, SpaceSlice } from "./slices/spaceSlice";
import { createNotesSlice, NotesSlice } from "./slices/notesSlice";
import { createTodosSlice, TodosSlice } from "./slices/todosSlice";
import { createSoundSlice, SoundSlice } from "./slices/soundSlice";
import { createCompanionSlice, CompanionSlice } from "./slices/companionSlice";
import { createSessionSlice, SessionSlice } from "./slices/sessionSlice";

export type AppStore = TimerSlice &
  SpaceSlice &
  NotesSlice &
  TodosSlice &
  SoundSlice &
  CompanionSlice &
  SessionSlice;

const idbStorage = {
  getItem: async (name: string) => {
    const value = await idbGet(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await idbSet(name, value);
  },
  removeItem: async (name: string) => {
    await idbDel(name);
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createTimerSlice(...a),
      ...createSpaceSlice(...a),
      ...createNotesSlice(...a),
      ...createTodosSlice(...a),
      ...createSoundSlice(...a),
      ...createCompanionSlice(...a),
      ...createSessionSlice(...a),
    }),
    {
      name: "focusden-store",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        activeSpaceId: state.activeSpaceId,
        notesContent: state.notesContent,
        todos: state.todos,
        soundTracks: state.soundTracks,
        projectName: state.projectName,
        workDuration: state.workDuration,
        breakDuration: state.breakDuration,
      }),
      onRehydrateStorage: () => (state) => {
        // After hydration, sync timeRemaining to the persisted workDuration.
        // timerStatus is not persisted (always "idle" on load), so
        // timeRemaining must match workDuration to show 0% progress.
        if (state) {
          state.timeRemaining = state.workDuration * 60;
        }
      },
    },
  ),
);
