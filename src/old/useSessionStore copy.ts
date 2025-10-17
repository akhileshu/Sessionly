"use client";
import { create } from "zustand";

export type Task = {
  id: string;
  title: string;
  blocks: number;
  notesBefore?: string;
  notesAfter?: string;
  tags?: string[];
  status?: "pending" | "done";
  startTime?: string;
  endTime?: string;
};

export type Session = {
  id: string;
  name: string;
  project?: string;
  category?: string;
  tasks: Task[];
  blockDurationMin: number;
  breakDurationMin: number;
  createdAt: string;
};

export const LS_KEY = "session-tracker:v1";
export const LS_META = "session-tracker-meta:v1";

type SessionStore = {
  session: Session | null;
  projects: string[];
  categories: string[];
  setSession: (session: Session | null) => void;
  setProjects: (projects: string[]) => void;
  setCategories: (categories: string[]) => void;
  loadFromStorage: () => void;
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  session: null,
  projects: [],
  categories: [],

  setSession: (session) => {
    set({ session });
    if (session) localStorage.setItem(LS_KEY, JSON.stringify(session));
    else localStorage.removeItem(LS_KEY);
  },

  setProjects: (projects) => {
    set({ projects });
    localStorage.setItem(
      LS_META,
      JSON.stringify({ projects, categories: get().categories })
    );
  },

  setCategories: (categories) => {
    set({ categories });
    localStorage.setItem(
      LS_META,
      JSON.stringify({ projects: get().projects, categories })
    );
  },

  loadFromStorage: () => {
    const metaRaw = localStorage.getItem(LS_META);
    if (metaRaw) {
      try {
        const meta = JSON.parse(metaRaw);
        set({
          projects: meta.projects || [],
          categories: meta.categories || [],
        });
      } catch {
        console.error("Failed to parse meta");
      }
    }

    const sessionRaw = localStorage.getItem(LS_KEY);
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        set({ session });
      } catch {
        console.error("Failed to parse session");
      }
    }
  },
}));
