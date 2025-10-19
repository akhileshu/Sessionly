"use client";
import { useTimerStore } from "@/old/useTimerStore";
import { useEffect } from "react";

export function TaskTimer() {
  const { taskId, type, elapsed, running, startTimer, stopTimer, tick } =
    useTimerStore();

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => startTimer("task-1", "work")}>Start Work</button>
      <button onClick={() => startTimer("task-1", "break")}>Start Break</button>
      <button onClick={stopTimer}>Stop</button>
      <span>
        {type ? `${type.toUpperCase()}: ` : ""}
        {running ? `${elapsed}s` : "Paused"}
      </span>
    </div>
  );
}
