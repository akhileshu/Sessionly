"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { useSessionStore } from "./sessionStore";
import { Input } from "@/components/input";
import { CategoryProjectSelect } from "@/components/CategoryProjectSelect";
import { Button } from "@/components/Button";

export function SessionCreation() {
  const {
    session,
    projects,
    categories,
    addProject,
    addCategory,
    createNewSession,
  } = useSessionStore();

  const [sessionName, setSessionName] = useState("");
  const [blockDurationMin, setBlockDurationMin] = useState(25);
  const [breakDurationMin, setBreakDurationMin] = useState(5);
  const [projectInput, setProjectInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  if (session)
    return <div>Session active — remove session to create a new one</div>;

  const handleCreateSession = () => {
    if (projectInput) addProject(projectInput);
    if (categoryInput) addCategory(categoryInput);

    createNewSession({
      name: sessionName,
      project: projectInput || undefined,
      category: categoryInput || undefined,
      blockDurationMin,
      breakDurationMin,
    });

    // reset local inputs
    setSessionName("");
    setProjectInput("");
    setCategoryInput("");
    setBlockDurationMin(25);
    setBreakDurationMin(5);
  };

  const initSample = () => {
    createNewSession({
      name: "Quick Session",
      project: "Personal",
      category: "Learning",
      blockDurationMin: 1,
      breakDurationMin: 1,
    });
  };

  return (
    <div
      className={cn("p-4 rounded-md border space-y-2", {
        session: "pointer-events-none opacity-50",
      })}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Session name"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
      </div>

      <div className="flex gap-2 items-center mt-2">
        <label className="text-sm">Block (min)</label>
        <Input
          type="number"
          min={1}
          value={blockDurationMin}
          onChange={(e) =>
            setBlockDurationMin(Math.max(1, Number(e.target.value) || 1))
          }
          className="w-20"
          size="sm"
        />

        <label className="text-sm">Break (min)</label>
        <Input
          type="number"
          min={0}
          value={breakDurationMin}
          onChange={(e) =>
            setBreakDurationMin(Math.max(0, Number(e.target.value) || 0))
          }
          className="w-20"
          size="sm"
        />

        <CategoryProjectSelect
          categories={categories}
          projects={projects}
          category={categoryInput}
          project={projectInput}
          onCategoryChange={setCategoryInput}
          onProjectChange={setProjectInput}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <Button onClick={handleCreateSession} variant="primary">
          Create Session
        </Button>
        <Button onClick={initSample} variant="outline">
          Init Sample
        </Button>
      </div>
    </div>
  );
}
