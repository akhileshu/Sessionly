/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteDialog } from "@/context/DeleteDialogContext";
import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";

/**
 * 
 * @example
 * <Button
                   icon="delete"
                   onClick={confirmable(() => {
                     setSession(null);
                     resetTimer();
 
                     localStorage.removeItem(LS_KEY);
                   })}
                   variant="danger"
                 >
                   Remove session
                 </Button>

 - wrap app with delete dialog provider
 @example
 <DeleteDialogProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="flex h-[calc(100vh-2rem)] m-4 border rounded-md ">
            <main className="flex-1 overflow-y-auto">
              <AppSidebar />
              <div className="flex">
                <SidebarTrigger />
                <SessionTracker className="min-w-6xl" />
              </div>
            </main>
          </div>
        </SidebarProvider>
      </DeleteDialogProvider>
 */
export function useDeleteHandler() {
  const { confirmBeforeDelete } = useUserPreferencesStore();
  const { confirm } = useDeleteDialog();

  async function handleDelete<T extends any[]>(
    action: (...args: T) => Promise<void> | void,
    ...args: T
  ) {
    if (confirmBeforeDelete) {
      return confirm(async () => await action(...args));
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
