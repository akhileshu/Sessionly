"use client";
import "@uiw/react-markdown-preview/markdown.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Button } from "../Button";

interface MarkdownViewerProps {
  md: string;
  onCopy?: () => void;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ md, onCopy }) => (
  <div className="flex flex-col gap-3 ">
    <MarkdownPreview
      source={md}
      className="bg-gray-50 dark:bg-gray-900 max-h-[30rem] overflow-auto p-4 border rounded-md border-gray-400"
    />
    {onCopy ? (
      <Button variant="primary" onClick={onCopy}>
        Copy to clipboard
      </Button>
    ) : null}
  </div>
);
