/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function useDeleteHandler() {
  const { confirmBeforeDelete } = useUserPreferencesStore();

  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleDelete<T extends any[]>(
    action: (...args: T) => Promise<void> | void,
    ...args: T
  ) {
    if (!confirmBeforeDelete) return await action(...args);

    // set pending action and open dialog
    setPendingAction(() => () => action(...args));
    setDialogOpen(true);
  }

  function confirmable<T extends any[]>(
    action: (...args: T) => Promise<void> | void
  ) {
    return (...args: T) => handleDelete(action, ...args);
  }

  // Internal Dialog component (render once at top-level)
  const DeleteDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              pendingAction?.();
              setDialogOpen(false);
              setPendingAction(null);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { handleDelete, confirmable, DeleteDialog };
}
