"use client";

import { useSessionStore } from "@/context/useSessionStore";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Button } from "../shared/Button";
import { SessionCreation } from "./SessionCreation";
import { SessionTable } from "./sessionTable";
import { TaskNotesSummary } from "./TaskNotesSummary";
import Timer from "./timer";

export default function SessionTracker({ className }: { className?: string }) {
  const {
    session,
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
  } = useSessionStore();

  const allTasksDone = session
    ? session.tasks.every((task) => task.status === "done")
    : false;

  // console.log("Zustand state useSessionStore:", useSessionStore());

  const timerRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (!timer.running || timer.currentBlockRemainingSec === 0) return;

    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      const { timer: currentTimer } = useSessionStore.getState();

      if (currentTimer.currentBlockRemainingSec <= 1) {
        handleBlockEnd();
        return;
      }

      setTimerState({
        currentBlockRemainingSec: currentTimer.currentBlockRemainingSec - 1,
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [
    timer.running,
    timer.currentBlockRemainingSec,
    handleBlockEnd,
    setTimerState,
  ]);

  // Manual work start function (for the UI)
  // const handleStartWork = () => {
  //   startWorkTimer();
  // };

  return (
    <div className={cn("p-4  space-y-4 ", className)}>
      <h2 className="text-xl font-semibold">Session Tracker</h2>

      <SessionCreation
        session={session}
        sessionName={sessionName}
        blockDurationMin={blockDurationMin}
        breakDurationMin={breakDurationMin}
        projectInput={projectInput}
        categoryInput={categoryInput}
        projects={projects}
        categories={categories}
        setSessionName={setSessionName}
        setBlockDurationMin={setBlockDurationMin}
        setBreakDurationMin={setBreakDurationMin}
        setProjectInput={setProjectInput}
        setCategoryInput={setCategoryInput}
        createSession={createSession}
        initSample={initSample}
      />

      {session ? (
        <div className="space-y-2 border-t pt-4">
          <SessionTable />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* <div className="border p-2 rounded space-y-2">
              {timer.currentTaskIndex !== null ? (
                <div>
                  <p>before notes</p>
                  <p>
                    {session.tasks[timer.currentTaskIndex]?.notesBefore ||
                      "no before notes"}
                  </p>

                  <hr />
                  <p>after notes</p>
                  <NotesPreview
                    content={
                      session.tasks[timer.currentTaskIndex]?.notesAfter ||
                      "no after notes"
                    }
                    noPopup
                  />
                </div>
              ) : (
                "no running task"
              )}
            </div> */}
            <TaskNotesSummary
              hasTask={timer.currentTaskIndex !== null}
              beforeNotes={session.tasks[timer.currentTaskIndex!]?.notesBefore}
              afterNotes={session.tasks[timer.currentTaskIndex!]?.notesAfter}
            />

            <Timer />
          </div>
        </div>
      ) : (
        <div className="border p-4 rounded text-center">
          No session. Create one above or
          <Button
            className="init-sample-session ml-2"
            onClick={initSample}
            variant="primary"
          >
            Create Sample Session
          </Button>
        </div>
      )}
    </div>
  );
}
