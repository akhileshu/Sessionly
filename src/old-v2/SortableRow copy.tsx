"use client";
import type { Task } from "@/context/useSessionStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import React from "react";

import { Icon } from "../components/icons";
import { Input } from "../components/input";
import { NotesEditorModal } from "./NotesEditorModal";
import { NotesPreview } from "./NotesPreview";

export const SortableRow: React.FC<{
  task: Task;
  blockDurationMin: number;
  isCurrent?: boolean;
  onChange: (t: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, blockDurationMin, isCurrent, onChange, onDelete }) => {
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
        className={`transition-colors ${isCurrent ? "bg-purple-400" : ""}`}
      >
        {/* Drag handle */}
        <td
          className="border px-2 py-1 cursor-grab"
          {...attributes}
          {...listeners}
        >
          <Icon name="drag" />
        </td>

        {/* Title */}
        <td className="border px-2 py-1">
          <Input
            className="w-full bg-transparent outline-none"
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
          />
        </td>

        {/* Blocks */}
        <td className="border px-2 py-1">
          <Input
            type="number"
            min={1}
            className="w-16 bg-transparent outline-none"
            value={task.blocks}
            onChange={(e) =>
              onChange({
                ...task,
                blocks: Math.max(1, Number(e.target.value) || 1),
              })
            }
          />
        </td>

        {/* Duration */}
        <td className="border px-2 py-1">
          {task.blocks * blockDurationMin} min
        </td>

        {/* Notes */}
        <td className="border px-2 py-1 relative group">
          {!task.endTime ? (
            <Input
              className="bg-transparent outline-none border-b border-gray-300"
              placeholder="Notes before"
              value={task.notesBefore}
              onChange={(e) =>
                onChange({ ...task, notesBefore: e.target.value })
              }
            />
          ) : (
            <div className="flex flex-col gap-1">
              <NotesEditorModal
                notes={task.notesAfter}
                onSave={(val) => onChange({ ...task, notesAfter: val })}
              />

              {/* Hover Preview */}
              <div className="hidden group-hover:block absolute left-0 top-full mt-1">
                <NotesPreview content={task.notesAfter || ""} />
              </div>
            </div>
          )}
        </td>

        {/* Tags */}
        <td className="border px-2 py-1">
          <Input
            className="w-full bg-transparent outline-none border-b border-gray-300"
            placeholder="tags (comma separated)"
            value={task.tags?.join(", ") || ""}
            onChange={(e) => handleTagChange(e.target.value)}
          />
        </td>

        {/* Start / End Time */}
        <td className="border px-2 py-1">
          {task.startTime ? new Date(task.startTime).toLocaleTimeString() : "-"}
        </td>
        <td className="border px-2 py-1">
          {task.endTime ? new Date(task.endTime).toLocaleTimeString() : "-"}
        </td>

        {/* Delete */}
        <td className="border px-2 py-1">
          <Icon
            title={`Delete Task - ${task.title}`}
            onClick={() => onDelete(task.id)}
            name="delete"
          />
        </td>
      </tr>
    </>
  );
};
