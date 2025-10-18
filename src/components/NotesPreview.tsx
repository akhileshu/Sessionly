import { cn } from "@/lib/utils";
import React from "react";
import ReactMarkdown from "react-markdown";

export const NotesPreview: React.FC<{
  content: string;
  className?: string;
  noPopup?: boolean;
}> = ({ content, className, noPopup }) => {
  if (!content) return null;

  return (
    <div
      className={cn(
        "absolute left-0 top-full mt-1 w-72 p-3 bg-white text-black border border-gray-300 shadow-lg rounded-lg z-50 text-sm overflow-auto max-h-64",
        {
          static: noPopup,
        }
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
