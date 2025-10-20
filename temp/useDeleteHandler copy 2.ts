/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteDialog } from "@/context/DeleteDialogContext";
import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";

export function useDeleteHandler() {
  const { confirmBeforeDelete } = useUserPreferencesStore();
  const { confirm } = useDeleteDialog();

  async function handleDelete<T extends any[]>(
    action: (...args: T) => Promise<void> | void,
    ...args: T
  ) {
    if (confirmBeforeDelete) {
      confirm(async () => await action(...args));
    }
    await action(...args);
  }

  function confirmable<T extends any[]>(
    action: (...args: T) => Promise<void> | void
  ) {
    return (...args: T) => handleDelete(action, ...args);
  }

  return { handleDelete, confirmable };
}
