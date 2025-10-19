"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";
import { Button } from "../shared/Button";

interface MarkdownViewerProps {
  md: string;
  showMdCopyButton?: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  md,
  showMdCopyButton,
}) => {
  return (
    <div className="flex flex-col gap-3 ">
      <MarkdownPreview
        source={md}
        className="bg-gray-50 dark:bg-gray-900 max-h-[30rem] overflow-auto p-4 border rounded-md border-gray-400"
      />
      {showMdCopyButton ? (
        <Button
          variant="primary"
          onClick={() => {
            navigator.clipboard.writeText(md).then(
              () => alert("Markdown copied!"),
              () => alert("Failed to copy.")
            );
          }}
        >
          Copy to clipboard
        </Button>
      ) : null}
    </div>
  );
};
