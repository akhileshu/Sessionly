"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createContext, useContext, useState, type ReactNode } from "react";

type DeleteAction = () => void;

interface DeleteDialogContextType {
  confirm: (action: DeleteAction) => void;
}

const DeleteDialogContext = createContext<DeleteDialogContextType | undefined>(
  undefined
);

export const DeleteDialogProvider = ({ children }: { children: ReactNode }) => {
  const [action, setAction] = useState<DeleteAction | null>(null);
  const [open, setOpen] = useState(false);

  const confirm = (a: DeleteAction) => {
    setAction(() => a);
    setOpen(true);
  };

  const handleDelete = () => {
    action?.();
    setOpen(false);
    setAction(null);
  };

  return (
    <DeleteDialogContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DeleteDialogContext.Provider>
  );
};

export const useDeleteDialog = () => {
  const ctx = useContext(DeleteDialogContext);
  if (!ctx)
    throw new Error("useDeleteDialog must be used within DeleteDialogProvider");
  return ctx;
};
