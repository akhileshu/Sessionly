"use client";
import type { Task } from "@/context/useSessionStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import React from "react";

import { cn } from "@/lib/utils";
import { AppModal } from "../app-model/app-model";
import { Icon } from "../shared/icons";
import { Input } from "../shared/input";

export const SortableRow: React.FC<{
  task: Task;
  blockDurationMin: number;
  isCurrent?: boolean;
  onChange: (t: Task) => void;
  onDelete: (id: string) => void;
  className?: string;
  isOdd?: boolean;
}> = ({
  task,
  blockDurationMin,
  isCurrent,
  onChange,
  onDelete,
  className,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={cn(
          "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          {
            "bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white":
              isCurrent,
          },
          className
        )}
      >
        {/* Drag handle */}
        <td {...attributes} {...listeners} className="px-4 py-3 cursor-grab ">
          <Icon name="drag" />
        </td>

        {/* Task */}
        <td className="px-4 py-3 w-64">
          <Input
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
            className="w-full bg-transparent outline-none"
          />
        </td>

        {/* Blocks */}
        <td className="px-4 py-3 w-24">
          <Input
            type="number"
            min={1}
            value={task.blocks}
            onChange={(e) =>
              onChange({
                ...task,
                blocks: Math.max(1, Number(e.target.value) || 1),
              })
            }
            className="w-full bg-transparent outline-none"
          />
        </td>

        {/* Duration */}
        <td className="px-4 py-3 w-24 ">
          <span
            className="inline-flex items-center px-2 py-0.5 text-xs font-medium
                                 bg-gray-100 dark:bg-gray-800 rounded text-gray-800 dark:text-gray-200"
          >
            {task.blocks * blockDurationMin} min
          </span>
          {/* {task.blocks * blockDurationMin} min */}
        </td>

        {/* Notes */}
        <td className="px-4 py-3">
          {!task.endTime ? (
            <Input
              placeholder="add before start notes"
              value={task.notesBefore}
              onChange={(e) =>
                onChange({ ...task, notesBefore: e.target.value })
              }
              className="bg-transparent outline-none border-b w-fit"
            />
          ) : (
            <AppModal
              trigger={
                task.notesAfter ? "View/Edit notes" : "add after end notes"
              }
              taskNotes={task.notesAfter ?? ""}
              type="AddTaskCompletedNotes"
              onSaveNotes={(val) => onChange({ ...task, notesAfter: val })}
            />
          )}
        </td>

        {/* Tags */}
        <td className="px-4 py-3 w-48">
          <Input
            placeholder="tags (comma separated)"
            value={task.tags?.join(", ") || ""}
            onChange={(e) =>
              onChange({
                ...task,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
            className="w-full bg-transparent outline-none border-b "
          />
        </td>

        {/* Start / End */}
        <td className="px-4 py-3 w-24 text-gray-500 dark:text-gray-400 text-xs">
          {task.startTime ? new Date(task.startTime).toLocaleTimeString() : "-"}
        </td>
        <td className="px-4 py-3 w-24 text-gray-500 dark:text-gray-400 text-xs">
          {task.endTime ? new Date(task.endTime).toLocaleTimeString() : "-"}
        </td>

        {/* Delete */}
        <td className="px-4 py-3 w-16 ">
          <Icon
            name="delete"
            onClick={() => onDelete(task.id)}
            title={`Delete ${task.title}`}
          />
        </td>
      </tr>
    </>
  );
};
