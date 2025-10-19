"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useState } from "react";
import { Button } from "../shared/Button";
import { MarkdownViewer } from "./MarkdownViewer";
import { NotesEditor } from "./NotesEditor";
import { ProjectCategoryForm } from "./ProjectCategoryForm";
import type { AppModalProps } from "./types";

export const AppModal: React.FC<AppModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState(props.isOpenDefault ?? false);

  const handleModalOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) props.onClose?.();
  };

  const modalContent = (() => {
    switch (props.type) {
      case "addProjectAndCategory":
        return <ProjectCategoryForm />;

      case "viewSessionAnalytics":
        return (
          <MarkdownViewer
            md={props.md}
            showMdCopyButton={props.showMdCopyButton}
          />
        );

      case "AddTaskCompletedNotes":
        return (
          <NotesEditor
            taskNotes={props.taskNotes}
            onSave={(notes: string) => {
              props.onSaveNotes(notes);
              handleModalOpenChange(false);
            }}
            skipButton={props.skipButton}
          />
        );
    }
  })();

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogTrigger>
        <Button>{props.trigger}</Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          {
            "min-w-3xl":
              props.type === "viewSessionAnalytics" ||
              props.type === "AddTaskCompletedNotes",
          },
          props.className
        )}
      >
        <DialogHeader>
          <DialogTitle>{props.trigger}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto">{modalContent}</div>
      </DialogContent>
    </Dialog>
  );
};
