import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferencesState {
  // Preferences
  audioOnNotification: boolean;
  confirmBeforeDelete: boolean;

  // Actions
  toggleAudioNotification: () => void;
  toggleConfirmBeforeDelete: () => void;
  setAudioNotification: (value: boolean) => void;
  setConfirmBeforeDelete: (value: boolean) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      audioOnNotification: true,
      confirmBeforeDelete: true,

      toggleAudioNotification: () =>
        set((state) => ({
          audioOnNotification: !state.audioOnNotification,
        })),

      toggleConfirmBeforeDelete: () =>
        set((state) => ({
          confirmBeforeDelete: !state.confirmBeforeDelete,
        })),

      setAudioNotification: (value) => set({ audioOnNotification: value }),
      setConfirmBeforeDelete: (value) => set({ confirmBeforeDelete: value }),
    }),
    {
      name: "user-preferences", // localStorage key
    }
  )
);
