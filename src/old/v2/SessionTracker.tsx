"use client";
import { useSessionStore } from "./sessionStore";
import { useTaskTimer } from "./useTaskTimer";
import { SessionTable } from "./SessionTable";
import { TimerPanel } from "./TimerPanel";
import { SessionCreation } from "./SessionCreation";

export default function SessionTrackerV2() {
  const session = useSessionStore((state) => state.session);
  useTaskTimer();

//   return <div> hello</div>

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Session Tracker</h2>
      <SessionCreation />
      {session ? (
        <>
          <SessionTable />
          <TimerPanel />
        </>
      ) : (
        <div className="border p-4 rounded text-center">No session yet</div>
      )}
    </div>
  );
}
