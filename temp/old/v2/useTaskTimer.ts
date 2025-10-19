import { useEffect } from "react";
import { useSessionStore } from "./sessionStore";

export function useTaskTimer() {
  const running = useSessionStore((state) => state.running);
  const handleBlockEnd = useSessionStore((state) => state.handleBlockEnd);
  const setCurrentBlockRemainingSec = useSessionStore(
    (state) => state.setCurrentBlockRemainingSec
  );

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setCurrentBlockRemainingSec((sec) => {
        if (sec <= 1) {
          handleBlockEnd();
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running, handleBlockEnd, setCurrentBlockRemainingSec]);
}
