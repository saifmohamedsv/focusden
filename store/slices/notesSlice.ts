import { StateCreator } from "zustand";

export interface NotesSlice {
  notesContent: string;
  setNotes: (content: string) => void;
}

export const createNotesSlice: StateCreator<NotesSlice, [], [], NotesSlice> = (set) => ({
  notesContent: "",
  setNotes: (content) => set({ notesContent: content }),
});
