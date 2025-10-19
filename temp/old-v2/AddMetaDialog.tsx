"use client";
import { useSessionStore } from "@/context/useSessionStore";
import { useState } from "react";
import { Button } from "../../src/components/shared/Button";
import { Input } from "../../src/components/shared/input";

export function AddMetaDialog({ onClose }: { onClose: () => void }) {
  const { addProject, addCategory } = useSessionStore();
  const [project, setProject] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-md w-80 space-y-4">
        <h3 className="text-lg font-semibold">Add Meta</h3>

        <div className="space-y-2">
          <Input
            placeholder="Add project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
          <Button onClick={() => addProject(project)}>Add Project</Button>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Add category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Button onClick={() => addCategory(category)}>Add Category</Button>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
