"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Button } from "./Button";
import type { Task } from "@/context/useSessionStore";



interface SortableRowProps {
  task: Task;
  blockDurationMin: number; // <-- needed for duration
  onChange: (t: Task) => void;
  onDelete: (id: string) => void;
}

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

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={isCurrent ? "bg-purple-400" : " "}
    >
      <td
        className="border px-2 py-1 cursor-grab"
        {...attributes}
        {...listeners}
      >
        ⠿
      </td>
      <td className="border px-2 py-1">
        <input
          className="w-full bg-transparent outline-none"
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
        />
      </td>
      <td className="border px-2 py-1">
        <input
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
      <td className="border px-2 py-1">{task.blocks * blockDurationMin} min</td>
      <td className="border px-2 py-1">
        {task.notesBefore || ""} / {task.notesAfter || ""}
      </td>
      <td className="border px-2 py-1">{task.tags?.join(", ") || ""}</td>
      <td className="border px-2 py-1">
        {task.startTime ? new Date(task.startTime).toLocaleTimeString() : "-"}
      </td>
      <td className="border px-2 py-1">
        {task.endTime ? new Date(task.endTime).toLocaleTimeString() : "-"}
      </td>
      <td className="border px-2 py-1">
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

