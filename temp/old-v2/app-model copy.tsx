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
import { cn } from "@/lib/utils";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useState, type ReactNode } from "react";
import { MarkdownViewer } from "../../src/components/app-model/MarkdownViewer";
import { NotesEditor } from "../../src/components/app-model/NotesEditor";
import { ProjectCategoryForm } from "../../src/components/app-model/ProjectCategoryForm";
import { Button } from "../../src/components/shared/Button";

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
  showMdCopyButton?: boolean;
  md?: string;
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
  showMdCopyButton,
  md,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const [draftNotes, setDraftNotes] = useState(
    taskNotes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
  );

  const resetModelState = () => {
    setDraftNotes(
      taskNotes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
    );

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

  // Mapping type -> content component
  const modalContentMap: Record<AppModalProps["type"], ReactNode> = {
    addProjectAndCategory: <ProjectCategoryForm />,
    viewSessionAnalytics: (() => {
      if (!md)
        return (
          <p className="text-red-500">
            Markdown content is required for viewSessionAnalytics modal.
          </p>
        );

      return <MarkdownViewer md={md} showMdCopyButton={showMdCopyButton} />;
    })(),

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
