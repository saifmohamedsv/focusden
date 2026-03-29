import { StateCreator } from "zustand";

export interface TimerSlice {
  timerStatus: "idle" | "running" | "paused" | "break" | "transition_to_break" | "transition_to_focus";
  timeRemaining: number;
  workDuration: number;
  breakDuration: number;
  currentRound: number;
  lastFocusDuration: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchToBreak: () => void;
  switchToWork: () => void;
  transitionToBreak: () => void;
  transitionToFocus: () => void;
  continueWorking: () => void;
  extendBreak: (minutes: number) => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (set, get) => ({
  timerStatus: "idle",
  timeRemaining: 25 * 60,
  workDuration: 25,
  breakDuration: 5,
  currentRound: 1,
  lastFocusDuration: 0,

  startTimer: () => set({ timerStatus: "running" }),
  pauseTimer: () => set({ timerStatus: "paused" }),
  resetTimer: () =>
    set((state) => ({
      timerStatus: "idle",
      timeRemaining: state.workDuration * 60,
      currentRound: 1,
      lastFocusDuration: 0,
    })),
  tick: () => {
    const { timeRemaining, timerStatus } = get();
    if (timerStatus !== "running" && timerStatus !== "break") return;
    if (timeRemaining <= 1) {
      if (timerStatus === "running") {
        get().transitionToBreak();
      } else {
        get().transitionToFocus();
      }
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },
  transitionToBreak: () =>
    set((state) => ({
      timerStatus: "transition_to_break",
      lastFocusDuration: state.workDuration,
    })),
  transitionToFocus: () =>
    set({ timerStatus: "transition_to_focus" }),
  switchToBreak: () =>
    set((state) => ({
      timerStatus: "break",
      timeRemaining: state.breakDuration * 60,
    })),
  switchToWork: () =>
    set((state) => ({
      timerStatus: "running",
      timeRemaining: state.workDuration * 60,
      currentRound: state.currentRound + 1,
    })),
  continueWorking: () =>
    set((state) => ({
      timerStatus: "running",
      timeRemaining: state.workDuration * 60,
    })),
  extendBreak: (minutes) =>
    set((state) => ({
      timerStatus: "break",
      timeRemaining: state.timeRemaining + minutes * 60,
    })),
  setWorkDuration: (minutes) =>
    set((state) => ({
      workDuration: minutes,
      timeRemaining: state.timerStatus === "idle" ? minutes * 60 : state.timeRemaining,
    })),
  setBreakDuration: (minutes) => set({ breakDuration: minutes }),
});
