"use client";

import { cn } from "@/lib/utils";
import { Button } from "../shared/Button";
import { Input } from "../shared/input";
import { CategoryProjectSelect } from "./CategoryProjectSelect";

interface SessionCreationProps {
  session: any;
  sessionName: string;
  blockDurationMin: number;
  breakDurationMin: number;
  projectInput: string;
  categoryInput: string;
  projects: string[];
  categories: string[];
  setSessionName: (v: string) => void;
  setBlockDurationMin: (v: number) => void;
  setBreakDurationMin: (v: number) => void;
  setProjectInput: (v: string) => void;
  setCategoryInput: (v: string) => void;
  createSession: () => void;
  initSample: () => void;
}

export function SessionCreation({
  session,
  sessionName,
  blockDurationMin,
  breakDurationMin,
  projectInput,
  categoryInput,
  projects,
  categories,
  setSessionName,
  setBlockDurationMin,
  setBreakDurationMin,
  setProjectInput,
  setCategoryInput,
  createSession,
}: // initSample,
SessionCreationProps) {
  if (session)
    return <div>Session active — remove session to create a new one</div>;

  return (
    <form
      onSubmit={createSession}
      className={cn("p-4 rounded-md border space-y-2 create-session", {
        session: "pointer-events-none opacity-50",
      })}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Session name"
          required
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
          min={1}
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

      <Button type="submit" variant="primary">
        Create Session
      </Button>
    </form>
  );
}
