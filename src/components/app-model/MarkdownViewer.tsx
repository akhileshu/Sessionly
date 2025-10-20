"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";
import { CopyToClipboardButton } from "../shared/CopyToClipboardButton";
import { cn } from "@/lib/utils";

export interface MarkdownViewerProps {
  md: string;
  showMdCopyButton?: boolean;
  maxHeight?: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  md,
  showMdCopyButton,
  maxHeight,
}) => {
  return (
    <div className="flex flex-col gap-3 ">
      <MarkdownPreview
        source={md}
        className={cn(
          "bg-gray-50 dark:bg-gray-900 max-h-[30rem] overflow-auto p-4 border rounded-md border-gray-400",
          {
            "max-h-[70vh]": maxHeight,
          }
        )}
      />
      {showMdCopyButton ? (
        <CopyToClipboardButton className="self-end" text={md} />
      ) : null}
    </div>
  );
};
