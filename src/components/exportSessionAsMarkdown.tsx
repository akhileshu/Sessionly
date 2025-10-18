import { useSessionStore } from "@/context/useSessionStore";
import { Button } from "./Button";

export function ExportSessionAsMarkdownButton() {
  const { session } = useSessionStore();
  function exportSessionAsMarkdown() {
    if (!session) return;
    const md: string[] = [`# Session: ${session.name}`];
    if (session.project) md.push(`**Project**: ${session.project}`);
    if (session.category) md.push(`**Category**: ${session.category}`);
    md.push(`**Created**: ${new Date(session.createdAt).toLocaleString()}`);
    md.push(
      "",
      `**Block duration**: ${session.blockDurationMin} min`,
      `**Break duration**: ${session.breakDurationMin} min`,
      "",
      "## Tasks"
    );
    session.tasks.forEach((t, i) => {
      md.push(
        `### ${i + 1}. ${t.title} ${t.status === "done" ? "✅" : ""}`,
        `- Blocks: ${t.blocks}`
      );
      if (t.tags?.length) md.push(`- Tags: ${t.tags.join(", ")}`);
      if (t.startTime)
        md.push(`- Start: ${new Date(t.startTime).toLocaleTimeString()}`);
      if (t.endTime)
        md.push(`- End: ${new Date(t.endTime).toLocaleTimeString()}`);
      if (t.notesBefore)
        md.push("- Notes (before):", "```", t.notesBefore, "```");
      if (t.notesAfter) md.push("- Notes (after):", "```", t.notesAfter, "```");
      md.push("");
    });
    navigator.clipboard.writeText(md.join("\n")).then(
      () => alert("Session copied to clipboard (Markdown)."),
      () => alert("Failed to copy to clipboard.")
    );
  }
  return (
    <Button icon="markdown" onClick={exportSessionAsMarkdown} variant="primary">
      Export Markdown
    </Button>
  );
}
