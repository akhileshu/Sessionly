"use client";
import { useSessionStore } from "@/context/useSessionStore";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./Button";


interface SessionAnalyticsModalProps {

}

export const SessionAnalyticsModal: React.FC<SessionAnalyticsModalProps> = ({}) => {
  const { session } = useSessionStore();
  function getMarkdown() {
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
    return md.join("\n");
    navigator.clipboard.writeText(md.join("\n")).then(
      () => alert("Session copied to clipboard (Markdown)."),
      () => alert("Failed to copy to clipboard.")
    );
  }
  const md= getMarkdown();
  if(!md) return null;
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(md).then(
      () => alert("Markdown copied to clipboard!"),
      () => alert("Failed to copy.")
    );
  };

  return (
    <>
      <Button icon="fileAnalytics" onClick={openModal} variant="primary">
        Session Analytics
      </Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-4 w-[90%] max-w-3xl shadow-lg flex flex-col gap-4"
            data-color-mode="light"
          >
            <div className="min-w-full  prose dark:prose-invert bg-gray-50 dark:bg-gray-900 max-h-[30rem] overflow-auto p-4 border rounded-md border-gray-400">
              <ReactMarkdown>{md}</ReactMarkdown>
            </div>

            <div className="flex justify-end gap-2">
              <Button icon="close" variant="ghost" onClick={closeModal}>
                Close
              </Button>

              <Button variant="primary" onClick={handleCopy}>
                copy to clipboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
