/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";

export function useDeleteHandler() {
  const { confirmBeforeDelete } = useUserPreferencesStore();

  async function handleDelete<T extends any[]>(
    action: (...args: T) => Promise<void> | void,
    ...args: T
  ) {
    if (confirmBeforeDelete) {
      const confirmed = window.confirm("Are you sure you want to delete this?");
      if (!confirmed) return;
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
