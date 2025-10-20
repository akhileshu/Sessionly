import { useSessionStore } from "@/context/useSessionStore";

export const useSessionUtils = () => {
  const {
    session,
    /*
    sessionName,
    projectInput,
    categoryInput,
    blockDurationMin,
    breakDurationMin,
    projects,
    categories,
    timer,
    setSessionName,
    setProjectInput,
    setCategoryInput,
    setBlockDurationMin,
    setBreakDurationMin,
    createSession,
    handleStartPause,
    initSample,
    setTimerState,
    handleBlockEnd,
    */
  } = useSessionStore();
  const isSessionStarted = session?.tasks.some((t) => t.startTime);
  return {
    isSessionStarted,
  };
};
