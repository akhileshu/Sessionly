"use client";

import { LS_KEY, useSessionStore } from "@/context/useSessionStore";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { SessionCreation } from "../components/SessionCreation";
import { SortableRow } from "../components/SortableRow";
import { ExportSessionAsMarkdownButton } from "../components/exportSessionAsMarkdown";

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
    setSession,
    addProject,
    addCategory,
    addEmptyTask,
    createSession,
    updateTask,
    deleteTask,
    handleStartPause,
    initSample,
    setTimerState,
    handleBlockEnd,
  } = useSessionStore();

  const sensors = useSensors(useSensor(PointerSensor));
  const timerRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (!timer.running || timer.currentTaskIndex === null) return;

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
    timer.currentTaskIndex,
    timer.timerType,
    handleBlockEnd,
    setTimerState,
  ]);

  function onDragEnd(e: { active: any; over: any }) {
    if (!session) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = session.tasks.findIndex((t) => t.id === active.id);
    const newIndex = session.tasks.findIndex((t) => t.id === over.id);

    useSessionStore.getState().reorderTasks(oldIndex, newIndex);
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{session.name}</h3>
              <div className="text-sm text-gray-600">
                {session.project && <span>Project: {session.project} </span>}
                {session.category && (
                  <span>• Category: {session.category}</span>
                )}
              </div>
            </div>
            <div className="space-x-2">
              <Button onClick={addEmptyTask} variant="primary">
                Add task
              </Button>
              <Button
                onClick={() => {
                  setSession(null);
                  localStorage.removeItem(LS_KEY);
                }}
                variant="danger"
              >
                Remove session
              </Button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={session.tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <table className="w-full border-collapse">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="border px-2 py-1 w-8"></th>
                    <th className="border px-2 py-1">Task</th>
                    <th className="border px-2 py-1 w-28">Blocks</th>
                    <th className="border px-2 py-1 w-28">Duration</th>
                    <th className="border px-2 py-1 w-48">Notes</th>
                    <th className="border px-2 py-1 w-48">Tags</th>
                    <th className="border px-2 py-1 w-24">Start</th>
                    <th className="border px-2 py-1 w-24">End</th>
                    <th className="border px-2 py-1 w-16">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {session.tasks.map((t, idx) => (
                    <SortableRow
                      key={t.id}
                      task={t}
                      blockDurationMin={session.blockDurationMin}
                      isCurrent={idx === timer.currentTaskIndex}
                      onChange={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </tbody>
                <tfoot className="bg-gray-700 text-white font-medium">
                  <tr>
                    <td className="border px-2 py-1">📊</td>
                    <td className="border px-2 py-1">{session.tasks.length}</td>
                    <td className="border px-2 py-1">
                      {session.tasks.reduce((sum, t) => sum + t.blocks, 0)}
                    </td>
                    <td className="border px-2 py-1">
                      {session.tasks.reduce(
                        (sum, t) => sum + t.blocks * session.blockDurationMin,
                        0
                      )}{" "}
                      min
                    </td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                </tfoot>
              </table>
            </SortableContext>
          </DndContext>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="border p-2 rounded space-y-2">
              <h4 className="font-medium">Task Notes (before / after)</h4>
              <div className="text-sm text-gray-600">
                Edit task notes in the table by clicking the task title.
              </div>
            </div>

            <div className="border p-2 rounded space-y-2">
              <h4 className="font-medium">Timer</h4>
              <div className="text-sm font-medium">
                Status:{" "}
                {timer.timerType === "work" ? "Work Time" : "Break Time"}
              </div>
              <Button onClick={handleStartPause} variant="primary">
                {timer.currentTaskIndex === null
                  ? "Start"
                  : timer.running
                  ? "Pause"
                  : "Resume"}
              </Button>

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
