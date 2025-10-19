"use client";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/Button";
import { useSessionStore } from "./sessionStore";
import { SortableRow } from "./SortableRow";

export function SessionTable() {
  const session = useSessionStore((state) => state.session);
  const addTask = useSessionStore((state) => state.addTask);
  const updateTask = useSessionStore((state) => state.updateTask);
  const deleteTask = useSessionStore((state) => state.deleteTask);
  const setSession = useSessionStore((state) => state.setSession);

  const sensors = useSensors(useSensor(PointerSensor));

  if (!session) return null;

  function onDragEnd({ active, over }: { active: any; over: any }) {
    if(!session) return;
    if (!over || active.id === over.id) return;
    const oldIndex = session.tasks.findIndex((t) => t.id === active.id);
    const newIndex = session.tasks.findIndex((t) => t.id === over.id);
    setSession({
      ...session,
      tasks: arrayMove(session.tasks, oldIndex, newIndex),
    });
  }

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{session.name}</h3>
        <div className="space-x-2">
          <Button
            onClick={() =>
              addTask({
                id: "t_" + Math.random().toString(36).slice(2, 9),
                title: "New Task",
                blocks: 1,
                tags: [],
                status: "pending",
              })
            }
            variant="primary"
          >
            Add Task
          </Button>
          <Button onClick={() => setSession(null)} variant="danger">
            Remove Session
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
                  onChange={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
