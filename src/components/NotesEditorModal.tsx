"use client";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { Button } from "./Button";

interface NotesEditorModalProps {
  notes: string | undefined;
  title?: string;
  onSave: (val: string) => void;
  saveText?: string;
  onSkip?: () => void;
  skipText?: string;
  isOpenDefault?: boolean;
}

export const NotesEditorModal: React.FC<NotesEditorModalProps> = ({
  notes,
  onSave,
  title = "Add notes",
  isOpenDefault = false,
  saveText = "Save",
  onSkip,
  skipText,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [draftNotes, setDraftNotes] = useState(
    notes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
  );

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setDraftNotes(
      notes ?? "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
    );
  };

  const handleSave = () => {
    onSave(draftNotes);
    closeModal();
  };

  return (
    <>
      <Button onClick={openModal} variant="primary">
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
              value={draftNotes}
              onChange={(val) => setDraftNotes(val || "")}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  setDraftNotes(
                    notes ??
                      "### ✅ Done\n- \n\n### ⏳ Pending\n- \n\n### 💡 Ideas\n- "
                  )
                }
              >
                reset notes
              </Button>
              <Button icon="close" variant="ghost" onClick={closeModal}>
                Close
              </Button>
              {onSkip && skipText ? (
                <Button onClick={onSkip} variant="ghost">
                  {skipText}
                </Button>
              ) : null}

              <Button variant="primary" onClick={handleSave}>
                {saveText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
