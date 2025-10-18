"use client";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useState } from "react";
import { Button } from "./Button";

interface NotesEditorModalProps {
  notes: string | undefined;
  onSave: (val: string) => void;
  title?: string;
  isOpenDefault?: boolean;
}

export const NotesEditorModal: React.FC<NotesEditorModalProps> = ({
  notes,
  onSave,
  title = "Add notes",
  isOpenDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [draftNotes, setDraftNotes] = useState(notes ?? "");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSave = () => {
    onSave(draftNotes);
    closeModal();
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="primary"
      >
        {notes ? "View/Edit notes" : title}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-4 w-[90%] max-w-3xl shadow-lg flex flex-col gap-4"
            data-color-mode="light"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Edit Structured Notes
            </h2>

            <MDEditor
              height={400}
              value={
                draftNotes ||
                "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
              }
              onChange={(val) => setDraftNotes(val || "")}
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
