import { StateCreator } from "zustand";

export interface TimerSlice {
  timerStatus: "idle" | "running" | "paused" | "break";
  timeRemaining: number;
  workDuration: number;
  breakDuration: number;
  currentRound: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchToBreak: () => void;
  switchToWork: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (set, get) => ({
  timerStatus: "idle",
  timeRemaining: 25 * 60,
  workDuration: 25,
  breakDuration: 5,
  currentRound: 1,

  startTimer: () => set({ timerStatus: "running" }),
  pauseTimer: () => set({ timerStatus: "paused" }),
  resetTimer: () =>
    set((state) => ({
      timerStatus: "idle",
      timeRemaining: state.workDuration * 60,
      currentRound: 1,
    })),
  tick: () => {
    const { timeRemaining, timerStatus } = get();
    if (timerStatus !== "running" && timerStatus !== "break") return;
    if (timeRemaining <= 1) {
      if (timerStatus === "running") {
        get().switchToBreak();
      } else {
        get().switchToWork();
      }
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },
  switchToBreak: () =>
    set((state) => ({
      timerStatus: "break",
      timeRemaining: state.breakDuration * 60,
    })),
  switchToWork: () =>
    set((state) => ({
      timerStatus: "idle",
      timeRemaining: state.workDuration * 60,
      currentRound: state.currentRound + 1,
    })),
  setWorkDuration: (minutes) =>
    set((state) => ({
      workDuration: minutes,
      timeRemaining: state.timerStatus === "idle" ? minutes * 60 : state.timeRemaining,
    })),
  setBreakDuration: (minutes) => set({ breakDuration: minutes }),
});
