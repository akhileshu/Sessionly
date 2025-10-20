"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSessionStore } from "@/context/useSessionStore";
import { useDeleteHandler } from "@/hooks/useDeleteHandler";
import { useSessionUtils } from "@/lib/session-utils";
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
import { Button } from "../shared/Button";
import { Pill } from "../shared/pill";
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
  const { confirmable } = useDeleteHandler();

  function onDragEnd(e: { active: any; over: any }) {
    if (!session) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = session.tasks.findIndex((t) => t.id === active.id);
    const newIndex = session.tasks.findIndex((t) => t.id === over.id);

    useSessionStore.getState().reorderTasks(oldIndex, newIndex);
  }
  const { isSessionStarted } = useSessionUtils();

  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <Accordion
      type="single"
      collapsible
      className=""
      defaultValue="session-table"
    >
      <AccordionItem value="session-table">
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
                  onClick={confirmable(() => {
                    setSession(null);
                    resetTimer();
                  })}
                  variant="danger"
                >
                  Remove session
                </Button>
              </div>
            </div>
            {/* <GhTableWithData /> */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={session.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
                disabled={isSessionStarted}
              >
                <table
                  className="w-full border-collapse table-auto mt-2 min-w-full text-sm text-left border shadow-sm
                        bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-md"
                >
                  <thead className=" bg-gray-50 dark:bg-gray-800 ">
                    <tr className="">
                      <th className="w-8 px-4 py-2 font-medium text-gray-700 dark:text-gray-300 ">
                        #
                      </th>
                      <th className="w-64 px-4 py-2 font-medium text-gray-700 dark:text-gray-300 text-left">
                        Task
                      </th>
                      <th className="w-24 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Blocks
                      </th>
                      <th className="w-24 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Duration
                      </th>
                      <th className="w-64 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Notes
                      </th>
                      <th className="w-48 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </th>
                      <th className="w-24 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Start
                      </th>
                      <th className="w-24 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        End
                      </th>
                      <th className="w-16 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {session.tasks.map((t, idx) => (
                      <SortableRow
                        key={t.id}
                        task={t}
                        blockDurationMin={session.blockDurationMin}
                        isCurrent={idx === timer.currentTaskIndex}
                        onChange={updateTask}
                        onDelete={confirmable((id: string) => deleteTask(id))}
                        isOdd={idx % 2 === 1}
                      />
                    ))}
                  </tbody>
                  <tfoot className="  bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        #
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        {session.tasks.length}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        {session.tasks.reduce((sum, t) => sum + t.blocks, 0)}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        {session.tasks.reduce(
                          (sum, t) => sum + t.blocks * session.blockDurationMin,
                          0
                        )}{" "}
                        min
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300"></td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300"></td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300"></td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300"></td>
                      <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300"></td>
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
