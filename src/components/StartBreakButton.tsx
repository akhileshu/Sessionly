"use client";
import { useSessionStore } from "@/context/useSessionStore";
import React from "react";
import { Button } from "./Button";
import { NotesEditorModal } from "./NotesEditorModal";

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
        <NotesEditorModal
          isOpenDefault
          notes={notesAfter}
          title="Enter notes / Start Break"
          saveText="Save notes & start break"
          onSave={handleSave}
          skipText="Skip & Start Break"
          onSkip={handleStartBreak}
        />
      )}
    </>
  );
};
