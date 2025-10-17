"use client";
import { create } from "zustand";

export type TimerType = "work" | "break";

interface TimerState {
  taskId: string | null;
  type: TimerType;
  remainingSec: number;
  running: boolean;
  startTimer: (taskId: string, type: TimerType, durationMin: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  taskId: null,
  type: "work",
  remainingSec: 0,
  running: false,

  startTimer: (taskId, type, durationMin) => {
    set({
      taskId,
      type,
      remainingSec: durationMin * 60,
      running: true,
    });
  },

  pauseTimer: () => set({ running: false }),

  resumeTimer: () => {
    if (get().remainingSec > 0) set({ running: true });
  },

  stopTimer: () => {
    set({
      taskId: null,
      type: "work",
      remainingSec: 0,
      running: false,
    });
  },

  tick: () => {
    const { running, remainingSec } = get();
    if (running && remainingSec > 0) {
      set({ remainingSec: remainingSec - 1 });
      if (remainingSec - 1 === 0) set({ running: false });
    }
  },
}));
