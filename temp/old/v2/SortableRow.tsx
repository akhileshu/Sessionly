"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useSessionStore } from "./sessionStore";

interface SortableRowProps {
  task: {
    id: string;
    title: string;
    blocks: number;
    tags: string[];
    status: string;
    startTime?: string;
    endTime?: string;
    notesBefore?: string;
    notesAfter?: string;
  };
  isCurrent?: boolean;
}

export function SortableRow({ task, isCurrent }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const updateTask = useSessionStore((state) => state.updateTask);
  const deleteTask = useSessionStore((state) => state.deleteTask);

  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [blocks, setBlocks] = useState(task.blocks);
  const [tags, setTags] = useState(task.tags.join(", "));
  const [notesBefore, setNotesBefore] = useState(task.notesBefore || "");
  const [notesAfter, setNotesAfter] = useState(task.notesAfter || "");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isCurrent ? "#e0f7fa" : undefined,
  };

  const saveTask = () => {
    updateTask({
      ...task,
      title,
      blocks: Math.max(0, Number(blocks)),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notesBefore,
      notesAfter,
    });
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-b"
    >
      <td className="border px-2 py-1 cursor-move">☰</td>

      {/* Title */}
      <td className="border px-2 py-1">
        {editingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTask}
            onKeyDown={(e) => e.key === "Enter" && saveTask()}
            className="w-full border rounded px-1"
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingTitle(true)}>{title}</span>
        )}
      </td>

      {/* Blocks */}
      <td className="border px-2 py-1">
        <input
          type="number"
          value={blocks}
          min={0}
          onChange={(e) => setBlocks(Number(e.target.value))}
          onBlur={saveTask}
          className="w-full border rounded px-1"
        />
      </td>

      {/* Tags */}
      <td className="border px-2 py-1">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onBlur={saveTask}
          className="w-full border rounded px-1"
        />
      </td>

      {/* Start / End */}
      <td className="border px-2 py-1">
        {task.startTime ? new Date(task.startTime).toLocaleTimeString() : "—"}
      </td>
      <td className="border px-2 py-1">
        {task.endTime ? new Date(task.endTime).toLocaleTimeString() : "—"}
      </td>

      {/* Notes */}
      <td className="border px-2 py-1">
        <textarea
          value={notesBefore}
          placeholder="Before notes"
          onChange={(e) => setNotesBefore(e.target.value)}
          onBlur={saveTask}
          className="w-full border rounded px-1"
        />
      </td>
      <td className="border px-2 py-1">
        <textarea
          value={notesAfter}
          placeholder="After notes"
          onChange={(e) => setNotesAfter(e.target.value)}
          onBlur={saveTask}
          className="w-full border rounded px-1"
        />
      </td>

      {/* Delete */}
      <td className="border px-2 py-1">
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-600 hover:text-red-800 font-bold"
        >
          ❌
        </button>
      </td>
    </tr>
  );
}
