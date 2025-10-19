"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/context/useSessionStore";
import { cn } from "@/lib/utils";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useState, type ReactNode } from "react";
import { Button } from "../Button";
import { getSessionMarkdown } from "./getSessionMarkdown";
import { MarkdownViewer } from "./MarkdownViewer";
import { NotesEditor } from "./NotesEditor";
import { ProjectCategoryForm } from "./ProjectCategoryForm";

interface AppModalProps {
  type:
    | "addProjectAndCategory"
    | "viewSessionAnalytics"
    | "AddTaskCompletedNotes";
  taskNotes?: string;
  trigger: string;
  onSaveNotes?: (val: string) => void;
  onClose?: () => void;
  className?: string;
  isOpenDefault?: boolean;
  skipButton?: {
    text: string;
    onClick: () => void;
  };
}

export const AppModal: React.FC<AppModalProps> = ({
  type,
  taskNotes,
  onSaveNotes,
  onClose,
  trigger,
  className,
  isOpenDefault = false,
  skipButton,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const { session, addProject, addCategory } = useSessionStore();
  const [project, setProject] = useState("");
  const [category, setCategory] = useState("");
  const [draftNotes, setDraftNotes] = useState(
    taskNotes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
  );

  const resetModelState = () => {
    setDraftNotes(
      taskNotes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
    );
    setProject("");
    setCategory("");
    onClose?.();
  };

  const resetNotes = () =>
    setDraftNotes(
      taskNotes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
    );
  const handleSaveNotes = () => {
    onSaveNotes?.(draftNotes);
    resetModelState();
    setIsOpen(false);
  };
  const handleCopyMarkdown = () => {
    const md = getSessionMarkdown(session);
    navigator.clipboard.writeText(md).then(
      () => alert("Markdown copied!"),
      () => alert("Failed to copy.")
    );
  };

  // Mapping type -> content component
  const modalContentMap: Record<AppModalProps["type"], ReactNode> = {
    addProjectAndCategory: (
      <ProjectCategoryForm
        {...{
          addProject,
          addCategory,
          project,
          setProject,
          category,
          setCategory,
        }}
      />
    ),
    viewSessionAnalytics: session && (
      <MarkdownViewer
        md={getSessionMarkdown(session)}
        onCopy={handleCopyMarkdown}
      />
    ),
    AddTaskCompletedNotes: (
      <NotesEditor
        draftNotes={draftNotes}
        setDraftNotes={setDraftNotes}
        onSave={handleSaveNotes}
        resetNotes={resetNotes}
        skipButton={skipButton}
      />
    ),
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          resetModelState();
        }}
      >
        <DialogTrigger>
          <Button>{trigger}</Button>
        </DialogTrigger>
        <DialogContent className={cn("", className)}>
          <DialogHeader>
            <DialogTitle>{trigger}</DialogTitle>
            <DialogDescription>DialogDescription.</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">{modalContentMap[type]}</div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
