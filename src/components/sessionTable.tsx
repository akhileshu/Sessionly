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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pill } from "./pill";

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
    <Accordion type="single" collapsible className="" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div>
            <Pill>Sesion</Pill>
            <span className="ml-2">{session.name}</span>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div>
            {" "}
            <div className="flex items-center justify-between ">
              <div>
                <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
                <div className="text-sm text-gray-600">
                  {session.project && <span>Project: {session.project} </span>}
                  {session.category && (
                    <span>• Category: {session.category}</span>
                  )}
                </div>
              </div>
              <div className="space-x-2">
                <Button icon="add" onClick={addEmptyTask} variant="primary">
                  Add task
                </Button>
                <Button
                  icon="delete"
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
                <table className="w-full border-collapse table-auto">
                  <thead className="bg-gray-700 text-white text-sm">
                    <tr>
                      <th className="w-8 px-2 py-1">#</th>
                      <th className="w-64 px-2 py-1 text-left">Task</th>
                      <th className="w-24 px-2 py-1">Blocks</th>
                      <th className="w-24 px-2 py-1">Duration</th>
                      <th className="w-64 px-2 py-1">Notes</th>
                      <th className="w-48 px-2 py-1">Tags</th>
                      <th className="w-24 px-2 py-1">Start</th>
                      <th className="w-24 px-2 py-1">End</th>
                      <th className="w-16 px-2 py-1">Delete</th>
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
                        isOdd={idx % 2 === 1}
                      />
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-700 text-white text-sm font-medium">
                    <tr>
                      <td className="px-2 py-1">#</td>
                      <td className="px-2 py-1">{session.tasks.length}</td>
                      <td className="px-2 py-1">
                        {session.tasks.reduce((sum, t) => sum + t.blocks, 0)}
                      </td>
                      <td className="px-2 py-1">
                        {session.tasks.reduce(
                          (sum, t) => sum + t.blocks * session.blockDurationMin,
                          0
                        )}{" "}
                        min
                      </td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                    </tr>
                  </tfoot>
                </table>
              </SortableContext>
            </DndContext>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
