"use client";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import ReactMarkdown from "react-markdown";
import { Button } from "../components/Button";

export const MarkdownViewer = ({ md, onCopy }: any) => (
  <>
    <div className="min-w-full prose dark:prose-invert bg-gray-50 dark:bg-gray-900 max-h-[30rem] overflow-auto p-4 border rounded-md border-gray-400">
      <ReactMarkdown>{md}</ReactMarkdown>
    </div>
    <Button variant="primary" onClick={onCopy}>
      Copy to clipboard
    </Button>
  </>
);
