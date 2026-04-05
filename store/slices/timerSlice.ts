import { StateCreator } from "zustand";

export interface TimerSlice {
  timerStatus: "idle" | "running" | "paused" | "break" | "transition_to_break" | "transition_to_focus";
  timerPhase: "work" | "break";
  timeRemaining: number;
  workDuration: number;
  breakDuration: number;
  currentRound: number;
  lastFocusDuration: number;
  /** Epoch ms when the timer last started/resumed — used for drift correction */
  tickAnchor: number | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  syncToWallClock: () => void;
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
  timerPhase: "work",
  timeRemaining: 25 * 60,
  workDuration: 25,
  breakDuration: 5,
  currentRound: 1,
  lastFocusDuration: 0,
  tickAnchor: null,

  startTimer: () => {
    const { timerStatus, timerPhase } = get();
    // No-op during transitions
    if (timerStatus === "transition_to_break" || timerStatus === "transition_to_focus") return;
    // Resume into the correct status based on phase
    set({
      timerStatus: timerPhase === "break" ? "break" : "running",
      tickAnchor: Date.now(),
    });
  },

  pauseTimer: () => {
    const { timerStatus } = get();
    // Only pause from active states
    if (timerStatus !== "running" && timerStatus !== "break") return;
    // Sync to wall clock before pausing so timeRemaining is accurate
    get().syncToWallClock();
    set({ timerStatus: "paused", tickAnchor: null });
  },

  resetTimer: () =>
    set((state) => ({
      timerStatus: "idle",
      timerPhase: "work",
      timeRemaining: state.workDuration * 60,
      currentRound: 1,
      lastFocusDuration: 0,
      tickAnchor: null,
    })),

  tick: () => {
    const { timerStatus } = get();
    if (timerStatus !== "running" && timerStatus !== "break") return;
    get().syncToWallClock();
  },

  syncToWallClock: () => {
    const { tickAnchor, timeRemaining, timerStatus } = get();
    if (!tickAnchor) return;

    const now = Date.now();
    const elapsedSecs = Math.floor((now - tickAnchor) / 1000);
    if (elapsedSecs <= 0) return;

    const newRemaining = timeRemaining - elapsedSecs;

    if (newRemaining <= 0) {
      // Timer completed — transition
      set({ timeRemaining: 0, tickAnchor: null });
      if (timerStatus === "running") {
        get().transitionToBreak();
      } else {
        get().transitionToFocus();
      }
      return;
    }

    set({ timeRemaining: newRemaining, tickAnchor: now });
  },

  transitionToBreak: () =>
    set((state) => ({
      timerStatus: "transition_to_break",
      timeRemaining: 0,
      lastFocusDuration: state.workDuration,
      tickAnchor: null,
    })),

  transitionToFocus: () =>
    set({ timerStatus: "transition_to_focus", timeRemaining: 0, tickAnchor: null }),

  switchToBreak: () =>
    set((state) => ({
      timerStatus: "break",
      timerPhase: "break",
      timeRemaining: state.breakDuration * 60,
      tickAnchor: Date.now(),
    })),

  switchToWork: () =>
    set((state) => ({
      timerStatus: "running",
      timerPhase: "work",
      timeRemaining: state.workDuration * 60,
      currentRound: state.currentRound + 1,
      tickAnchor: Date.now(),
    })),

  continueWorking: () =>
    set((state) => ({
      timerStatus: "running",
      timerPhase: "work",
      timeRemaining: state.workDuration * 60,
      tickAnchor: Date.now(),
    })),

  extendBreak: (minutes) =>
    set((state) => ({
      timerStatus: "break",
      timerPhase: "break",
      timeRemaining: state.timeRemaining + minutes * 60,
      tickAnchor: Date.now(),
    })),

  setWorkDuration: (minutes) =>
    set((state) => ({
      workDuration: minutes,
      timeRemaining: state.timerStatus === "idle" ? minutes * 60 : state.timeRemaining,
    })),

  setBreakDuration: (minutes) => set({ breakDuration: minutes }),
});
