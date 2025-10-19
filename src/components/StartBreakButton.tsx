"use client";
import { useSessionStore } from "@/context/useSessionStore";
import React from "react";
import { Button } from "./Button";
import { AppModal } from "./app-model/app-model";

interface StartBreakButtonProps {}

export const StartBreakButton: React.FC<StartBreakButtonProps> = ({}) => {
  const { session, timer, setTimerState, startBreakTimer, updateTask } =
    useSessionStore();
  if (!session || timer.currentTaskIndex == null) return null;
  const currentTask = session.tasks[timer.currentTaskIndex];
  const { notesAfter } = currentTask;
  const handleStartBreak = () => {
    if (timer.timerType === "work") startBreakTimer();
    setTimerState({ running: true });
  };

  const handleSave = (notes: string) => {
    updateTask({
      ...currentTask,
      notesAfter: notes,
    });
    handleStartBreak();
  };

  return (
    <>
      {notesAfter ? (
        <Button icon="breakfast" onClick={handleStartBreak} variant="primary">
          Start Break
        </Button>
      ) : (
        <AppModal
          isOpenDefault
          trigger="Enter notes / Start Break"
          onSaveNotes={handleSave}
          // todo
          // saveText="Save notes & start break"
          type="AddTaskCompletedNotes"
          skipButton={{
            text: "Skip & Start Break",
            onClick: handleStartBreak,
          }}
        />
      )}
    </>
  );
};
