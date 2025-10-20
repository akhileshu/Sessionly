import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";
import { cn } from "@/lib/utils";

export function PreferencesPanel({ className }: { className?: string }) {
  const {
    audioOnNotification,
    confirmBeforeDelete,
    toggleAudioNotification,
    toggleConfirmBeforeDelete,
  } = useUserPreferencesStore();

  return (
    <div className={cn("space-y-2", className)}>
      <label className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          checked={audioOnNotification}
          onChange={toggleAudioNotification}
        />
        Audio on notification
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={confirmBeforeDelete}
          onChange={toggleConfirmBeforeDelete}
        />
        Show confirmation before deletion
      </label>
    </div>
  );
}
