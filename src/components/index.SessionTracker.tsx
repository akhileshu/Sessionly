"use client";

import { useSessionStore } from "@/context/useSessionStore";
import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { ExportSessionAsMarkdownButton } from "./exportSessionAsMarkdown";
import { NotesPreview } from "./NotesPreview";
import { SessionCreation } from "./SessionCreation";
import { SessionTable } from "./sessionTable";
import { StartBreakButton } from "./StartBreakButton";
import { WorkTimerButton } from "./work-timer-button";
import { TaskNotesSummary } from "./TaskNotesSummary";

export default function SessionTracker() {
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
    startBreakTimer,
    startWorkTimer,
    updateTask,
  } = useSessionStore();

  console.log("Zustand state useSessionStore:", useSessionStore());

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
  const handleStartWork = () => {
    startWorkTimer();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
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

            <div className="border p-2 rounded space-y-2">
              <h4 className="font-medium">Timer</h4>
              <div className="text-sm font-medium">
                Status:{" "}
                {timer.timerType === "work" ? "Work Time" : "Break Time"}
                {timer.timerType === "break" &&
                  !timer.running &&
                  " (Ready to Start)"}
              </div>

              <div className="space-x-2">
                {timer.timerType === "work" ? (
                  // <Button icon={"MdOutlineWorkOutline"} onClick={handleStartPause} variant="primary">
                  //   {timer.currentTaskIndex === null
                  //     ? "Start Work"
                  //     : timer.running
                  //     ? "Pause"
                  //     : "Resume"}
                  // </Button>
                  <WorkTimerButton />
                ) : (
                  <>
                    {!timer.running ? (
                      <StartBreakButton />
                    ) : (
                      <Button icon="pause" onClick={handleStartPause} variant="primary">
                        Pause Break
                      </Button>
                    )}
                    <Button onClick={handleStartWork} variant="primary">
                      Skip to Work
                    </Button>
                  </>
                )}
              </div>

              <div className="text-sm">
                Current task:{" "}
                {timer.currentTaskIndex !== null
                  ? session.tasks[timer.currentTaskIndex]?.title
                  : "—"}
              </div>
              <div className="text-2xl font-mono">
                {Math.floor(timer.currentBlockRemainingSec / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(timer.currentBlockRemainingSec % 60)
                  .toString()
                  .padStart(2, "0")}
              </div>
              <ExportSessionAsMarkdownButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="border p-4 rounded text-center">
          No session. Create one above or click{" "}
          <Button onClick={initSample} variant="primary">
            init sample
          </Button>
          .
        </div>
      )}
    </div>
  );
}
