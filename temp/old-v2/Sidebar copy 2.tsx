"use client";
import { useSessionStore } from "@/context/useSessionStore";
import { useState } from "react";
import { Button } from "../components/shared/Button";
import { Icon } from "../components/shared/icons";
import { AddMetaDialog } from "./AddMetaDialog";

export function Sidebar() {
  const {
    projects,
    categories,
    removeProject,
    removeCategory,
    clearProjects,
    clearCategories,
    initSampleProjectsAndCategories,
  } = useSessionStore();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <aside className="w-64 border-r p-2 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* <h3 className="font-semibold text-lg">Meta</h3> */}
        <Button
          onClick={() => setShowDialog(true)}
          variant="primary"
          icon="add"
          size={"sm"}
        >
          {" "}
          add project / category
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
      {!projects.length && !categories.length ? (
        <Button
          onClick={initSampleProjectsAndCategories}
          variant="primary"
          icon="add"
          size={"sm"}
        >
          Add Sample Projects and Categories
        </Button>
      ) : null}
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
    <div className="space-y-2 border border-gray-400 rounded-md p-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">{title}</h4>
        {items.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            icon="delete"
            onClick={onDeleteAll}
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
              className="flex justify-between items-center border-b border-gray-700 px-2 py-1 "
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
