// useDeleteHandler.ts
import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";

export function useDeleteHandler() {
  const { confirmBeforeDelete } = useUserPreferencesStore();

  async function handleDelete(action: () => Promise<void> | void) {
    if (confirmBeforeDelete) {
      const confirmed = window.confirm("Are you sure you want to delete this?");
      if (!confirmed) return;
    }
    await action();
  }

  // create reusable wrapper
  function confirmable(action: () => void) {
    return () => handleDelete(action);
  }

  return { handleDelete, confirmable };
}
