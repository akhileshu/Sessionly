"use client";
import type { Task } from "@/context/useSessionStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import React from "react";

import { cn } from "@/lib/utils";
import { AppModal } from "./app-model/app-model";
import { Icon } from "./icons";
import { Input } from "./input";

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
  isOdd,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleTagChange = (value: string) =>
    onChange({
      ...task,
      tags: value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={cn(
          "transition-colors bg-gray-900 text-gray-200 border-b border-gray-500",
          {
            "bg-blue-500 text-white": isCurrent,
            "bg-gray-950": isOdd,
          },
          className
        )}
      >
        {/* Drag handle */}
        <td
          {...attributes}
          {...listeners}
          className="px-2 py-1 cursor-grab text-center"
        >
          <Icon name="drag" />
        </td>

        {/* Task */}
        <td className="px-2 py-1 w-64">
          <Input
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
            className="w-full bg-transparent outline-none"
          />
        </td>

        {/* Blocks */}
        <td className="px-2 py-1 w-24">
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
        <td className="px-2 py-1 w-24 text-center">
          {task.blocks * blockDurationMin} min
        </td>

        {/* Notes */}
        <td className="px-2 py-1">
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
              taskNotes={task.notesAfter}
              type="AddTaskCompletedNotes"
              onSaveNotes={(val) => onChange({ ...task, notesAfter: val })}
            />
          )}
        </td>

        {/* Tags */}
        <td className="px-2 py-1 w-48">
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
        <td className="px-2 py-1 w-24 text-center">
          {task.startTime ? new Date(task.startTime).toLocaleTimeString() : "-"}
        </td>
        <td className="px-2 py-1 w-24 text-center">
          {task.endTime ? new Date(task.endTime).toLocaleTimeString() : "-"}
        </td>

        {/* Delete */}
        <td className="px-2 py-1 w-16 text-center">
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
