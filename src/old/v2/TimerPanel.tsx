"use client";
import { Button } from "@/components/Button";
import { useSessionStore } from "./sessionStore";

export function TimerPanel() {
  const session = useSessionStore((state) => state.session);
  const running = useSessionStore((state) => state.running);
  const startTimer = useSessionStore((state) => state.startTimer);
  const pauseTimer = useSessionStore((state) => state.pauseTimer);
  const currentTaskIndex = useSessionStore((state) => state.currentTaskIndex);
  const currentBlockRemainingSec = useSessionStore(
    (state) => state.currentBlockRemainingSec
  );
  const timerType = useSessionStore((state) => state.timerType);

  function exportMarkdown() {
    if (!session) return;
    const md: string[] = [`# Session: ${session.name}`];
    if (session.project) md.push(`**Project**: ${session.project}`);
    if (session.category) md.push(`**Category**: ${session.category}`);
    md.push(
      `**Created**: ${new Date(session.createdAt).toLocaleString()}`,
      "",
      `## Tasks`
    );
    session.tasks.forEach((t, i) => {
      md.push(`### ${i + 1}. ${t.title} ${t.status === "done" ? "✅" : ""}`);
      md.push(`- Blocks: ${t.blocks}`);
      if (t.tags?.length) md.push(`- Tags: ${t.tags.join(", ")}`);
      if (t.startTime)
        md.push(`- Start: ${new Date(t.startTime).toLocaleTimeString()}`);
      if (t.endTime)
        md.push(`- End: ${new Date(t.endTime).toLocaleTimeString()}`);
      md.push("");
    });
    navigator.clipboard.writeText(md.join("\n")).then(
      () => alert("Session copied to clipboard (Markdown)."),
      () => alert("Failed to copy to clipboard.")
    );
  }

  if (!session) return null;

  return (
    <div className="border p-2 rounded space-y-2 mt-4">
      <h4 className="font-medium">Timer</h4>
      <div className="text-sm font-medium">
        Status: {timerType === "work" ? "Work Time" : "Break Time"}
      </div>
      <Button onClick={running ? pauseTimer : startTimer} variant="primary">
        {currentTaskIndex === null ? "Start" : running ? "Pause" : "Resume"}
      </Button>
      <div className="text-sm">
        Current task:{" "}
        {currentTaskIndex !== null
          ? session.tasks[currentTaskIndex]?.title
          : "—"}
      </div>
      <div className="text-2xl font-mono">
        {Math.floor(currentBlockRemainingSec / 60)
          .toString()
          .padStart(2, "0")}
        :{(currentBlockRemainingSec % 60).toString().padStart(2, "0")}
      </div>
      <Button onClick={exportMarkdown} variant="primary">
        Export Markdown
      </Button>
    </div>
  );
}
