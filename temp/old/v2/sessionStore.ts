import type { Session, Task } from "@/context/useSessionStore";
import { create } from "zustand";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

interface SessionState {
  session: Session | null;
  projects: string[];
  categories: string[];
  currentTaskIndex: number | null;
  timerType: "work" | "break";
  running: boolean;
  currentBlockRemainingSec: number;
  breakTimeoutId: number | null;

  // setters
  setSession: (s: Session | null) => void;
  setCurrentTaskIndex: (idx: number | null) => void;
  setTimerType: (type: "work" | "break") => void;
  setRunning: (r: boolean) => void;
  setCurrentBlockRemainingSec: (
    sec: number | ((prev: number) => number)
  ) => void;

  // task & session actions
  addProject: (p: string) => void;
  addCategory: (c: string) => void;
  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  createNewSession: (data: Partial<Session>) => void;

  // timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  advanceTask: () => void;
  handleBlockEnd: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  projects: [],
  categories: [],
  currentTaskIndex: null,
  timerType: "work",
  running: false,
  currentBlockRemainingSec: 0,
  breakTimeoutId: null,

  // basic setters
  setSession: (s) => set({ session: s }),
  setCurrentTaskIndex: (idx) => set({ currentTaskIndex: idx }),
  setTimerType: (type) => set({ timerType: type }),
  setRunning: (running) => set({ running }),
  setCurrentBlockRemainingSec: (secOrFn) =>
    set((state) => ({
      currentBlockRemainingSec:
        typeof secOrFn === "function"
          ? secOrFn(state.currentBlockRemainingSec)
          : secOrFn,
    })),

  // session helpers
  addProject: (p) =>
    set((state) => ({ projects: [...new Set([...state.projects, p])] })),
  addCategory: (c) =>
    set((state) => ({ categories: [...new Set([...state.categories, c])] })),

  // task CRUD
  addTask: (t) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: { ...state.session, tasks: [...state.session.tasks, t] },
      };
    }),

  updateTask: (t) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          tasks: state.session.tasks.map((x) => (x.id === t.id ? t : x)),
        },
      };
    }),

  deleteTask: (id) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          tasks: state.session.tasks.filter((t) => t.id !== id),
        },
      };
    }),

  // create session
  createNewSession: ({
    name,
    project,
    category,
    blockDurationMin,
    breakDurationMin,
  }) => {
    const s: Session = {
      id: uid("s_"),
      name: name || `Session ${new Date().toLocaleString()}`,
      project,
      category,
      tasks: [],
      blockDurationMin: blockDurationMin || 25,
      breakDurationMin: breakDurationMin || 5,
      createdAt: new Date().toISOString(),
    };
    if (project) get().addProject(project);
    if (category) get().addCategory(category);
    set({
      session: s,
      currentTaskIndex: null,
      timerType: "work",
      running: false,
      currentBlockRemainingSec: 0,
    });
  },

  // timer control
  startTimer: () => set({ running: true }),
  pauseTimer: () => set({ running: false }),
  resetTimer: () => {
    const { breakTimeoutId } = get();
    if (breakTimeoutId) clearTimeout(breakTimeoutId);
    set({
      currentBlockRemainingSec: 0,
      running: false,
      currentTaskIndex: null,
      timerType: "work",
      breakTimeoutId: null,
    });
  },

  advanceTask: () => {
    const {
      session,
      currentTaskIndex,
      setCurrentTaskIndex,
      setTimerType,
      setCurrentBlockRemainingSec,
      setRunning,
    } = get();
    if (!session) return;
    const next = session.tasks.findIndex(
      (t, i) => i > (currentTaskIndex ?? -1) && t.status !== "done"
    );
    if (next === -1) {
      set({
        running: false,
        currentTaskIndex: null,
        currentBlockRemainingSec: 0,
      });
    } else {
      setCurrentTaskIndex(next);
      setTimerType("work");
      setCurrentBlockRemainingSec(session.blockDurationMin * 60);
      setRunning(true);
    }
  },

  handleBlockEnd: () => {
    const {
      session,
      currentTaskIndex,
      timerType,
      updateTask,
      setTimerType,
      setCurrentBlockRemainingSec,
      setRunning,
      advanceTask,
    } = get();

    if (!session || currentTaskIndex === null) return;

    const task = session.tasks[currentTaskIndex];
    const updatedTask = { ...task };

    if (timerType === "work") {
      updatedTask.blocks = Math.max(0, task.blocks - 1);
      if (updatedTask.blocks === 0) updatedTask.status = "done";
      if (!updatedTask.endTime && updatedTask.status === "done")
        updatedTask.endTime = new Date().toISOString();
      updateTask(updatedTask);

      if (updatedTask.blocks > 0 && session.breakDurationMin > 0) {
        setTimerType("break");
        setCurrentBlockRemainingSec(session.breakDurationMin * 60);
        setRunning(false);

        // start break timer
        const timeoutId = window.setTimeout(() => {
          setTimerType("work");
          setCurrentBlockRemainingSec(session.blockDurationMin * 60);
          setRunning(true);
        }, session.breakDurationMin * 60 * 1000);

        set({ breakTimeoutId: timeoutId });
        return;
      }
    } else {
      // break finished
      setTimerType("work");
      setCurrentBlockRemainingSec(session.blockDurationMin * 60);
      setRunning(true);
      return;
    }

    // move to next task
    advanceTask();
  },
}));
