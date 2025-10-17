"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { SessionCreation } from "../components/SessionCreation";
import { SortableRow } from "../components/SortableRow";
import {
  LS_KEY,
  useSessionStore,
  type Session,
  type Task,
} from "@/context/useSessionStore";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function SessionTracker() {
  const {
    projects,
    categories,
    setProjects,
    setCategories,
    session,
    setSession,
  } = useSessionStore();

  const [sessionName, setSessionName] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [blockDurationMin, setBlockDurationMin] = useState(25);
  const [breakDurationMin, setBreakDurationMin] = useState(5);

  const sensors = useSensors(useSensor(PointerSensor));

  const [running, setRunning] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [currentBlockRemainingSec, setCurrentBlockRemainingSec] = useState(0);
  const [timerType, setTimerType] = useState<"work" | "break">("work");

  const timerRef = useRef<number | null>(null);
  const breakTimeoutRef = useRef<number | null>(null);

  /* ------------------ Helpers ------------------ */
  function addProject(project: string) {
    if (!project) return;
    setProjects([...new Set([...projects, project])]);
    setProjectInput("");
  }

  function addCategory(category: string) {
    if (!category) return;
    setCategories([...new Set([...categories, category])]);
    setCategoryInput("");
  }

  function addEmptyTask() {
    if (!session) return;
    const t: Task = {
      id: uid("t_"),
      title: "New task",
      blocks: 1,
      tags: [],
      status: "pending",
    };
    setSession({ ...session, tasks: [...session.tasks, t] });
  }

  function createSession() {
    const s: Session = {
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
    setSession(s);
    setSessionName("");
  }

  function updateTask(t: Task) {
    if (!session) return;
    setSession({
      ...session,
      tasks: session.tasks.map((x) => (x.id === t.id ? t : x)),
    });
  }

  function deleteTask(id: string) {
    if (!session) return;
    setSession({ ...session, tasks: session.tasks.filter((t) => t.id !== id) });
  }

  function onDragEnd(e: { active: any; over: any }) {
    if (!session) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = session.tasks.findIndex((t) => t.id === active.id);
    const newIndex = session.tasks.findIndex((t) => t.id === over.id);
    setSession({
      ...session,
      tasks: arrayMove(session.tasks, oldIndex, newIndex),
    });
  }

  // unified timer effect for work + break
  useEffect(() => {
    if (!running || currentTaskIndex === null) return;

    // clear old interval
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setCurrentBlockRemainingSec((s) => {
        if (s <= 1) {
          handleBlockEnd();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, currentTaskIndex, timerType]);

  function handleBlockEnd() {
    if (!session || currentTaskIndex === null) return;
    const task = session.tasks[currentTaskIndex];
    let updatedTask: Task;

    if (timerType === "work") {
      // Work block finished
      updatedTask = { ...task, blocks: Math.max(0, task.blocks - 1) };

      // If task is completely done
      if (updatedTask.blocks === 0) {
        updatedTask.status = "done";
        updatedTask.endTime = new Date().toISOString();
      }
      updateTask(updatedTask);

      // If break is needed
      if (updatedTask.blocks > 0 && session.breakDurationMin > 0) {
        setTimerType("break");
        setCurrentBlockRemainingSec(session.breakDurationMin * 60);

        breakTimeoutRef.current = window.setTimeout(() => {
          // After break, continue work
          setTimerType("work");
          setCurrentBlockRemainingSec(session.blockDurationMin * 60);
          setRunning(true);
        }, session.breakDurationMin * 60 * 1000);

        setRunning(false); // pause work timer during break
        return; // exit early, don’t advance to next task yet
      }
    } else {
      // Break finished, continue with same task if not done
      setTimerType("work");
      setCurrentBlockRemainingSec(session.blockDurationMin * 60);
      setRunning(true);
      return; // stay on the same task
    }

    // No break needed or task done, move to next task
    advanceToNextTask();
  }

  function handleStartPause() {
    if (!session || session.tasks.length === 0) return;

    // If no task started yet, start the first one
    if (currentTaskIndex === null) {
      const firstIdx = session.tasks.findIndex((t) => t.status !== "done");
      if (firstIdx === -1) return; // all done
      setCurrentTaskIndex(firstIdx);
      setTimerType("work");
      const task = session.tasks[firstIdx];
      if (!task.startTime)
        updateTask({ ...task, startTime: new Date().toISOString() });
      setCurrentBlockRemainingSec(session.blockDurationMin * 60);
      setRunning(true);
      return;
    }

    // If timer running, pause
    if (running) {
      setRunning(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (breakTimeoutRef.current) window.clearTimeout(breakTimeoutRef.current);
      return;
    }

    // If paused, resume
    setRunning(true);
  }

  function advanceToNextTask() {
    if (!session) return;
    const nextIdx = session.tasks.findIndex(
      (t, i) => i > (currentTaskIndex ?? -1) && t.status !== "done"
    );
    if (nextIdx === -1) {
      setRunning(false);
      setCurrentTaskIndex(null);
      setCurrentBlockRemainingSec(0);
      return;
    }
    setCurrentTaskIndex(nextIdx);
    setTimerType("work");
    const nextTask = session.tasks[nextIdx];
    if (!nextTask.startTime)
      updateTask({ ...nextTask, startTime: new Date().toISOString() });
    setCurrentBlockRemainingSec(session.blockDurationMin * 60);
    setRunning(true);
  }

  function exportSessionAsMarkdown() {
    if (!session) return;
    const md: string[] = [`# Session: ${session.name}`];
    if (session.project) md.push(`**Project**: ${session.project}`);
    if (session.category) md.push(`**Category**: ${session.category}`);
    md.push(`**Created**: ${new Date(session.createdAt).toLocaleString()}`);
    md.push(
      "",
      `**Block duration**: ${session.blockDurationMin} min`,
      `**Break duration**: ${session.breakDurationMin} min`,
      "",
      "## Tasks"
    );
    session.tasks.forEach((t, i) => {
      md.push(
        `### ${i + 1}. ${t.title} ${t.status === "done" ? "✅" : ""}`,
        `- Blocks: ${t.blocks}`
      );
      if (t.tags?.length) md.push(`- Tags: ${t.tags.join(", ")}`);
      if (t.startTime)
        md.push(`- Start: ${new Date(t.startTime).toLocaleTimeString()}`);
      if (t.endTime)
        md.push(`- End: ${new Date(t.endTime).toLocaleTimeString()}`);
      if (t.notesBefore)
        md.push("- Notes (before):", "```", t.notesBefore, "```");
      if (t.notesAfter) md.push("- Notes (after):", "```", t.notesAfter, "```");
      md.push("");
    });
    navigator.clipboard.writeText(md.join("\n")).then(
      () => alert("Session copied to clipboard (Markdown)."),
      () => alert("Failed to copy to clipboard.")
    );
  }

  function initSample() {
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
      blockDurationMin: 1,
      breakDurationMin: 1,
      createdAt: new Date().toISOString(),
    });
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
                      isCurrent={idx === currentTaskIndex}
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
                Status: {timerType === "work" ? "Work Time" : "Break Time"}
              </div>
              <Button onClick={handleStartPause} variant="primary">
                {currentTaskIndex === null
                  ? "Start"
                  : running
                  ? "Pause"
                  : "Resume"}
              </Button>

              <div className="text-sm">
                Current task:{" "}
                {currentTaskIndex !== null
                  ? session.tasks[currentTaskIndex]?.title
                  : "—"}
              </div>
              <div className="text-2xl font-mono">
                {Math.floor(currentBlockRemainingSec / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(currentBlockRemainingSec % 60).toString().padStart(2, "0")}
              </div>
              <Button onClick={exportSessionAsMarkdown} variant="primary">
                Export Markdown
              </Button>
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
