"use client";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useState } from "react";
import { Button } from "../shared/Button";

export const NotesEditor = ({
  taskNotes,
  onSave,
  skipButton,
}: {
  taskNotes: string;
  onSave: (val: string) => void;
  skipButton?: {
    text: string;
    onClick: () => void;
  };
}) => {
  function getSafeNotes() {
    return taskNotes
      ? taskNotes
      : "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- ";
  }
  const [draftNotes, setDraftNotes] = useState(getSafeNotes());
  return (
    <>
      <MDEditor
        height={400}
        value={draftNotes}
        onChange={(val) => setDraftNotes(val || "")}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setDraftNotes(getSafeNotes());
          }}
        >
          Reset Notes
        </Button>
        {skipButton ? (
          <Button variant="ghost" onClick={skipButton.onClick}>
            {skipButton.text}
          </Button>
        ) : null}

        <Button variant="primary" onClick={() => onSave(draftNotes)}>
          Save
        </Button>
      </div>
    </>
  );
};
