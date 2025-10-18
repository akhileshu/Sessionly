"use client";
import { useState } from "react";
import { AddMetaDialog } from "./AddMetaDialog";
import { Button } from "./Button";
import { useSessionStore } from "@/context/useSessionStore";
import { Icon } from "./icons";

export function Sidebar() {
  const {
    projects,
    categories,
    removeProject,
    removeCategory,
    clearProjects,
    clearCategories,
  } = useSessionStore();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <aside className="w-64 border-r p-4 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Meta</h3>
        <Button
          onClick={() => setShowDialog(true)}
          variant="outline"
          title="Add new meta"
        >
          <Icon name="add" />
        </Button>
      </div>

      {/* Projects */}
      <Section
        title="Projects"
        items={projects}
        onDeleteItem={removeProject}
        onDeleteAll={clearProjects}
      />

      {/* Categories */}
      <Section
        title="Categories"
        items={categories}
        onDeleteItem={removeCategory}
        onDeleteAll={clearCategories}
      />

      {showDialog && <AddMetaDialog onClose={() => setShowDialog(false)} />}
    </aside>
  );
}

/* ---------------------------------------- */
/* Reusable Section Component */
/* ---------------------------------------- */
function Section({
  title,
  items,
  onDeleteItem,
  onDeleteAll,
}: {
  title: string;
  items: string[];
  onDeleteItem: (name: string) => void;
  onDeleteAll: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">{title}</h4>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteAll}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Delete All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No {title.toLowerCase()}</p>
      ) : (
        <ul className="text-sm space-y-1">
          {items.map((item) => (
            <li
              key={item}
              className="flex justify-between items-center border rounded px-2 py-1 hover:bg-gray-50"
            >
              <span>{item}</span>
              <Icon
                name="delete"
                size={18}
                className="cursor-pointer text-gray-500 hover:text-red-500"
                onClick={() => onDeleteItem(item)}
                title={`Delete ${item}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
