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
import { Button } from "./Button";
import { SortableRow } from "./SortableRow";

export function SessionTable() {
  const {
    session,
    updateTask,
    deleteTask,
    timer,
    addEmptyTask,
    setSession,
    resetTimer,
  } = useSessionStore();

  if (!session) return null;

  function onDragEnd(e: { active: any; over: any }) {
    if (!session) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = session.tasks.findIndex((t) => t.id === active.id);
    const newIndex = session.tasks.findIndex((t) => t.id === over.id);

    useSessionStore.getState().reorderTasks(oldIndex, newIndex);
  }

  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{session.name}</h3>
          <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
          <div className="text-sm text-gray-600">
            {session.project && <span>Project: {session.project} </span>}
            {session.category && <span>• Category: {session.category}</span>}
          </div>
        </div>
        <div className="space-x-2">
          <Button onClick={addEmptyTask} variant="primary">
            Add task
          </Button>
          <Button
            onClick={() => {
              setSession(null);
              resetTimer();

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
    </div>
  );
}
