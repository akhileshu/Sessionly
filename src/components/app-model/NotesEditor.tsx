"use client";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { Button } from "../Button";

export const NotesEditor = ({
  draftNotes,
  setDraftNotes,
  onSave,
  resetNotes,
  skipButton,
}: any) => (
  <>
    <MDEditor
      height={400}
      value={draftNotes}
      onChange={(val) => setDraftNotes(val || "")}
    />
    <div className="flex justify-end gap-2 mt-2">
      <Button variant="ghost" onClick={resetNotes}>
        Reset Notes
      </Button>
      {skipButton ? (
        <Button variant="ghost" onClick={skipButton.onClick}>
          {skipButton.text}
        </Button>
      ) : null}

      <Button variant="primary" onClick={onSave}>
        Save
      </Button>
    </div>
  </>
);
