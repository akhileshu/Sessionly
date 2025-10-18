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

type TimerState = {
  running: boolean;
  currentTaskIndex: number | null;
  currentBlockRemainingSec: number;
  timerType: "work" | "break";
};

type AppState = {
  // Session data
  session: Session | null;
  projects: string[];
  categories: string[];

  // UI state
  sessionName: string;
  projectInput: string;
  categoryInput: string;
  blockDurationMin: number;
  breakDurationMin: number;

  // Timer state
  timer: TimerState;

  // Actions
  setSession: (session: Session | null) => void;
  setProjects: (projects: string[]) => void;
  setCategories: (categories: string[]) => void;
  setSessionName: (name: string) => void;
  setProjectInput: (input: string) => void;
  setCategoryInput: (input: string) => void;
  setBlockDurationMin: (minutes: number) => void;
  setBreakDurationMin: (minutes: number) => void;
  //
  removeProject: (project: string) => void;
  removeCategory: (category: string) => void;
  clearProjects: () => void;
  clearCategories: () => void;
  initSampleProjectsAndCategories: () => void;

  // Timer actions
  setTimerState: (state: Partial<TimerState>) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;

  // Business logic actions
  addProject: (project: string) => void;
  addCategory: (category: string) => void;
  addEmptyTask: () => void;
  createSession: () => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (oldIndex: number, newIndex: number) => void;
  handleStartPause: () => void;
  advanceToNextTask: () => void;
  handleBlockEnd: () => void;
  startBreakTimer: () => void;
  startWorkTimer: () => void;
  initSample: () => void;

  // Storage
  loadFromStorage: () => void;
};

export const LS_KEY = "session-tracker:v1";
export const LS_META = "session-tracker-meta:v1";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export const useSessionStore = create<AppState>((set, get) => ({
  // Initial state
  session: null,
  projects: [],
  categories: [],
  sessionName: "",
  projectInput: "",
  categoryInput: "",
  blockDurationMin: 25,
  breakDurationMin: 5,
  timer: {
    running: false,
    currentTaskIndex: null,
    currentBlockRemainingSec: 0,
    timerType: "work",
  },

  // Setters
  setSession: (session) => {
    set({ session });
    if (session) localStorage.setItem(LS_KEY, JSON.stringify(session));
    else localStorage.removeItem(LS_KEY);
  },

  setProjects: (projects) => {
    set({ projects });
    localStorage.setItem(
      LS_META,
      JSON.stringify({
        projects,
        categories: get().categories,
      })
    );
  },

  setCategories: (categories) => {
    set({ categories });
    localStorage.setItem(
      LS_META,
      JSON.stringify({
        projects: get().projects,
        categories,
      })
    );
  },

  setSessionName: (sessionName) => set({ sessionName }),
  setProjectInput: (projectInput) => set({ projectInput }),
  setCategoryInput: (categoryInput) => set({ categoryInput }),
  setBlockDurationMin: (blockDurationMin) => set({ blockDurationMin }),
  setBreakDurationMin: (breakDurationMin) => set({ breakDurationMin }),
  //

  removeProject: (project: string) => {
    const { projects, setProjects } = get();
    const updated = projects.filter((p) => p !== project);
    setProjects(updated);
  },

  removeCategory: (category: string) => {
    const { categories, setCategories } = get();
    const updated = categories.filter((c) => c !== category);
    setCategories(updated);
  },

  clearProjects: () => {
    set({ projects: [] });
    localStorage.setItem(
      LS_META,
      JSON.stringify({
        projects: [],
        categories: get().categories,
      })
    );
  },

  clearCategories: () => {
    set({ categories: [] });
    localStorage.setItem(
      LS_META,
      JSON.stringify({
        projects: get().projects,
        categories: [],
      })
    );
  },
  initSampleProjectsAndCategories: () => {
    const sampleProjects = ["Personal", "Work", "Learning"];
    const sampleCategories = ["Frontend", "Backend", "Design"];
    const { setProjects, setCategories } = get();
    setProjects(sampleProjects);
    setCategories(sampleCategories);
  },

  // Timer actions
  setTimerState: (newState) =>
    set((state) => ({ timer: { ...state.timer, ...newState } })),

  startTimer: () =>
    set((state) => ({ timer: { ...state.timer, running: true } })),
  pauseTimer: () =>
    set((state) => ({ timer: { ...state.timer, running: false } })),
  resetTimer: () =>
    set({
      timer: {
        running: false,
        currentTaskIndex: null,
        currentBlockRemainingSec: 0,
        timerType: "work",
      },
    }),

  // Business logic
  addProject: (project) => {
    if (!project) return;
    const { projects, setProjects } = get();
    setProjects([...new Set([...projects, project])]);
    set({ projectInput: "" });
  },

  addCategory: (category) => {
    if (!category) return;
    const { categories, setCategories } = get();
    setCategories([...new Set([...categories, category])]);
    set({ categoryInput: "" });
  },

  addEmptyTask: () => {
    const { session, setSession } = get();
    if (!session) return;

    const task: Task = {
      id: uid("t_"),
      title: "New task",
      blocks: 1,
      tags: [],
      status: "pending",
    };

    setSession({ ...session, tasks: [...session.tasks, task] });
  },

  createSession: () => {
    const {
      sessionName,
      projectInput,
      categoryInput,
      blockDurationMin,
      breakDurationMin,
      setSession,
      addProject,
      addCategory,
    } = get();

    const session: Session = {
      id: uid("s_"),
      name: sessionName || `Session ${new Date().toLocaleString()}`,
      project: projectInput || undefined,
      category: categoryInput || undefined,
      tasks: [],
      blockDurationMin,
      breakDurationMin,
      createdAt: new Date().toISOString(),
    };

    if (projectInput) addProject(projectInput);
    if (categoryInput) addCategory(categoryInput);

    setSession(session);
    set({ sessionName: "" });
  },

  updateTask: (updatedTask) => {
    const { session, setSession } = get();
    if (!session) return;

    setSession({
      ...session,
      tasks: session.tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    });
  },

  deleteTask: (id) => {
    const { session, setSession } = get();
    if (!session) return;

    setSession({
      ...session,
      tasks: session.tasks.filter((t) => t.id !== id),
    });
  },

  reorderTasks: (oldIndex, newIndex) => {
    const { session, setSession } = get();
    if (!session) return;

    const tasks = [...session.tasks];
    const [movedTask] = tasks.splice(oldIndex, 1);
    tasks.splice(newIndex, 0, movedTask);

    setSession({ ...session, tasks });
  },

  handleStartPause: () => {
    const {
      session,
      timer,
      setTimerState,
      startTimer,
      pauseTimer,
      updateTask,
    } = get();

    if (!session || session.tasks.length === 0) return;

    // If no task started yet, start the first one
    if (timer.currentTaskIndex === null) {
      const firstIdx = session.tasks.findIndex((t) => t.status !== "done");
      if (firstIdx === -1) return; // all done

      const task = session.tasks[firstIdx];
      if (!task.startTime) {
        updateTask({ ...task, startTime: new Date().toISOString() });
      }

      setTimerState({
        currentTaskIndex: firstIdx,
        timerType: "work",
        currentBlockRemainingSec: session.blockDurationMin * 60,
        running: true,
      });
      return;
    }

    // Toggle running state
    if (timer.running) {
      pauseTimer();
    } else {
      startTimer();
    }
  },

  // New helper method to start break timer
  startBreakTimer: () => {
    const { session, timer, setTimerState, pauseTimer } = get();
    if (!session || timer.currentTaskIndex === null) return;

    setTimerState({
      timerType: "break",
      currentBlockRemainingSec: session.breakDurationMin * 60,
      running: false, // Don't auto-start break timer
    });
    pauseTimer();
    notify("taskCompleted");
  },

  // New helper method to start work timer
  startWorkTimer: () => {
    const { session, timer, setTimerState, startTimer } = get();
    if (!session || timer.currentTaskIndex === null) return;

    setTimerState({
      timerType: "work",
      currentBlockRemainingSec: session.blockDurationMin * 60,
      running: true,
    });
    startTimer();
  },

  advanceToNextTask: () => {
    const {
      session,
      timer,
      setTimerState,
      updateTask,
      resetTimer,
      pauseTimer,
    } = get();
    if (!session) return;

    const nextIdx = session.tasks.findIndex(
      (t, i) => i > (timer.currentTaskIndex ?? -1) && t.status !== "done"
    );

    if (nextIdx === -1) {
      resetTimer();
      return;
    }

    const nextTask = session.tasks[nextIdx];
    if (!nextTask.startTime) {
      updateTask({ ...nextTask, startTime: new Date().toISOString() });
    }

    setTimerState({
      currentTaskIndex: nextIdx,
      timerType: "work",
      currentBlockRemainingSec: session.blockDurationMin * 60,
      running: false, // Don't auto-start work timer
    });
    pauseTimer();
    notify("breakCompleted");
  },

  handleBlockEnd: () => {
    const { session, timer, updateTask, advanceToNextTask, startBreakTimer } =
      get();

    if (!session || timer.currentTaskIndex === null) return;

    const task = session.tasks[timer.currentTaskIndex];

    if (timer.timerType === "work") {
      // Work block finished
      const updatedTask = { ...task, blocks: Math.max(0, task.blocks - 1) };

      // If task is completely done
      if (updatedTask.blocks === 0) {
        updatedTask.status = "done";
        updatedTask.endTime = new Date().toISOString();
      }

      updateTask(updatedTask);

      // If break is needed and task still has blocks remaining
      if (/*updatedTask.blocks > 0 && */ session.breakDurationMin > 0) {
        // Start break timer immediately
        startBreakTimer();
        return; // exit early - don't advance to next task
      }

      // No break needed or task is done, move to next task
      advanceToNextTask();
    } else {
      // todo
      // Break finished - start work timer for the same task
      // const { startWorkTimer } = get();
      // startWorkTimer();
      advanceToNextTask();
    }
  },

  initSample: () => {
    const { session, setSession } = get();
    if (session) return;

    setSession({
      id: uid("s_"),
      name: "Quick Session",
      project: "Personal",
      category: "Learning",
      tasks: [
        {
          id: uid("t_"),
          title: "Read React docs",
          blocks: 1,
          tags: ["react"],
          status: "pending",
        },
        {
          id: uid("t_"),
          title: "Implement table",
          blocks: 1,
          tags: ["react", "dnd"],
          status: "pending",
        },
      ],
      // todo
      blockDurationMin: 0.1,
      breakDurationMin: 0.1,
      createdAt: new Date().toISOString(),
    });
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



// function notify(type: "breakCompleted" | "taskCompleted") {
//   // Check notification permission
//   if (Notification.permission !== "granted") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         console.log("Notification permission granted");
//       } else {
//         console.warn("Notification permission denied");
//       }
//     });
//     return;
//   }

//   let title = "";
//   let body = "";
//   let soundSrc = "";

//   switch (type) {
//     case "breakCompleted":
//       title = "Break Over!";
//       body = "Time to get back to work 💪";
//       soundSrc = "/Sessionly/sounds/break-end.mp3";
//       break;

//     case "taskCompleted":
//       title = "Break Over!";
//       body = "Great job! Time to take a short break 😌";
//       soundSrc = "/Sessionly/sounds/task-completed.mp3";
//       break;

//     default:
//       console.warn("Unknown notification type:", type);
//       return;
//   }

//   // Create and configure audio
//   const audio = new Audio(soundSrc);
//   audio.volume = 0.8;

//   let intervalId: number;
//   let playAttempts = 0;
//   const maxPlayAttempts = 3;

//   // Function to play audio and schedule repeat
//   const playLoop = () => {
//     audio.play().catch((error) => {
//       console.error("Failed to play audio:", error);
//       playAttempts++;

//       if (playAttempts < maxPlayAttempts) {
//         console.log(`Retrying audio playback (attempt ${playAttempts + 1})`);
//         setTimeout(playLoop, 1000);
//       } else {
//         console.error("Max audio playback attempts reached");
//       }
//     });
//   };

//   // Function to start the loop after first play
//   const startLoop = () => {
//     intervalId = window.setInterval(() => {
//       audio.currentTime = 0;
//       audio.play().catch((error) => {
//         console.warn("Audio playback in loop failed:", error);
//       });
//     }, audio.duration * 1000 + 2000);
//   };

//   // Set up audio event listeners
//   audio.addEventListener("loadeddata", () => {
//     console.log("Audio loaded, duration:", audio.duration);
//   });

//   audio.addEventListener("canplaythrough", () => {
//     console.log("Audio can play through, starting playback");
//     playLoop();
//   });

//   audio.addEventListener("play", () => {
//     console.log("Audio started playing");
//     // Start the loop after the first successful play
//     if (!intervalId) {
//       startLoop();
//     }
//   });

//   audio.addEventListener("error", (e) => {
//     console.error("Audio loading error:", e);
//     console.error("Audio error details:", audio.error);
//   });

//   // Create notification
//   let notification: Notification;
//   try {
//     notification = new Notification(title, { body });
//     console.log("Notification created successfully");
//   } catch (error) {
//     console.error("Failed to create notification:", error);
//     // Even if notification fails, try to play sound
//     playLoop();
//     return;
//   }

//   const stopAudio = () => {
//     console.log("Stopping audio");
//     if (intervalId) {
//       clearInterval(intervalId);
//     }
//     audio.pause();
//     audio.currentTime = 0;
//   };

//   notification.onclick = () => {
//     console.log("Notification clicked");
//     stopAudio();
//     notification.close();
//   };

//   notification.onclose = () => {
//     console.log("Notification closed");
//     stopAudio();
//   };

//   // Auto-close notification after 10 seconds
//   setTimeout(() => {
//     if (notification) {
//       notification.close();
//     }
//   }, 10000);
// }

function notify(type: "breakCompleted" | "taskCompleted") {
  // Check notification permission
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.warn("Notification permission denied");
      }
    });
    return;
  }

  let title = "";
  let body = "";
  let soundSrc = "";

  switch (type) {
    case "breakCompleted":
      title = "Break Over!";
      body = "Time to get back to work 💪";
      soundSrc = "/Sessionly/sounds/break-end.mp3";
      break;

    case "taskCompleted":
      title = "Task Completed 🎯";
      body = "Great job! Time to take a short break 😌";
      soundSrc = "/Sessionly/sounds/task-completed.mp3";
      break;

    default:
      console.warn("Unknown notification type:", type);
      return;
  }

  // Create and configure audio
  const audio = new Audio(soundSrc);
  audio.volume = 0.8;
  audio.loop = true; // Enable built-in looping

  let intervalId: number;
  let playAttempts = 0;
  const maxPlayAttempts = 3;
  let audioStopped = false;

  // Function to play audio
  const playAudio = () => {
    if (audioStopped) {
      console.log("Audio already stopped, skipping playback");
      return;
    }

    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
      playAttempts++;

      if (playAttempts < maxPlayAttempts && !audioStopped) {
        console.log(`Retrying audio playback (attempt ${playAttempts + 1})`);
        setTimeout(playAudio, 1000);
      } else {
        console.error("Max audio playback attempts reached");
      }
    });
  };

  // Set up audio event listeners
  audio.addEventListener("loadeddata", () => {
    console.log("Audio loaded, duration:", audio.duration);
  });

  audio.addEventListener("canplaythrough", () => {
    console.log("Audio can play through, starting playback");
    playAudio();
  });

  audio.addEventListener("play", () => {
    console.log("Audio started playing");
  });

  audio.addEventListener("error", (e) => {
    console.error("Audio loading error:", e);
    console.error("Audio error details:", audio.error);
  });

  // Create notification
  let notification: Notification;
  try {
    notification = new Notification(title, { body });
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Failed to create notification:", error);
    // Even if notification fails, try to play sound
    playAudio();

    // Auto-stop after 2 minutes if notification failed
    setTimeout(() => {
      if (!audioStopped) {
        console.log("2 minutes elapsed, stopping audio");
        stopAudio();
      }
    }, 2 * 60 * 1000);

    return;
  }

  let stopAudio = () => {
    if (audioStopped) return;

    console.log("Stopping audio");
    audioStopped = true;

    if (intervalId) {
      clearInterval(intervalId);
    }
    audio.pause();
    audio.currentTime = 0;
  };

  // Stop audio when notification is clicked
  notification.onclick = () => {
    console.log("Notification clicked");
    stopAudio();
    notification.close();

    // Also focus the app window if possible
    if (window.focus) {
      window.focus();
    }
  };

  // Stop audio when notification is closed
  notification.onclose = () => {
    console.log("Notification closed");
    stopAudio();
  };

  // Stop audio after 2 minutes automatically
  const autoStopTimeout = setTimeout(() => {
    if (!audioStopped) {
      console.log("2 minutes elapsed, stopping audio automatically");
      stopAudio();
      notification.close();
    }
  }, 2 * 60 * 1000);

  // Also stop audio when user interacts with the app (clicks anywhere)
  const stopOnInteraction = () => {
    if (!audioStopped) {
      console.log("App interaction detected, stopping audio");
      stopAudio();
      notification.close();
      clearTimeout(autoStopTimeout);
      document.removeEventListener("click", stopOnInteraction);
    }
  };

  // Listen for any click in the app
  document.addEventListener("click", stopOnInteraction);

  // Clean up event listener when audio stops
  const originalStopAudio = stopAudio;
  stopAudio = () => {
    originalStopAudio();
    document.removeEventListener("click", stopOnInteraction);
    clearTimeout(autoStopTimeout);
  };
}