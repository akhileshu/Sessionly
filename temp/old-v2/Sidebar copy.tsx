"use client";
import { useSessionStore } from "@/context/useSessionStore";
import { useState } from "react";
import { Button } from "../../src/components/shared/Button";
import { AddMetaDialog } from "./AddMetaDialog";

export function Sidebar() {
  const { projects, categories } = useSessionStore();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <aside className="w-64 border-r p-3 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Meta</h3>
        <Button onClick={() => setShowDialog(true)}>+</Button>
      </div>

      <div>
        <h4 className="font-medium mb-1">Projects</h4>
        <ul className="text-sm space-y-1">
          {projects.map((p: string) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-1">Categories</h4>
        <ul className="text-sm space-y-1">
          {categories.map((c: string) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      {showDialog && <AddMetaDialog onClose={() => setShowDialog(false)} />}
    </aside>
  );
}
