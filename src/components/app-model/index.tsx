"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSessionStore, type Session } from "@/context/useSessionStore";
import { cn } from "@/lib/utils";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useState } from "react";
import { Button } from "../shared/Button";
import { NotesEditor } from "./NotesEditor";
import { ProjectCategoryForm } from "./ProjectCategoryForm";
import { SessionAnalytics, sessionCreatedXAgo } from "./SessionAnalytics";
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
          <SessionAnalytics
            MarkdownViewerProps={{
              md: props.md,
              showMdCopyButton: props.showMdCopyButton,
            }}
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
  const { session } = useSessionStore();
  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogTrigger>
        <Button>{props.trigger}</Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          {
            "min-w-[98vw] h-[95vh]": props.type === "viewSessionAnalytics",
            "min-w-3xl": props.type === "AddTaskCompletedNotes",
          },
          props.className
        )}
      >
        <DialogHeader>
          <DialogTitle>{getHeaderTitle(props, session)}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto">{modalContent}</div>
      </DialogContent>
    </Dialog>
  );
};

function getHeaderTitle(props: AppModalProps, session?: Session) {
  if (props.type === "viewSessionAnalytics" && session) {
    return (
      <span>
        {props.trigger}{" "}
        <span className="text-sm text-muted-foreground font-normal">
          — {sessionCreatedXAgo(session)}
        </span>
      </span>
    );
  }

  return <span>{props.trigger}</span>;
}

