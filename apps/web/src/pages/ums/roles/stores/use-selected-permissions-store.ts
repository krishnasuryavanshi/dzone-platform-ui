import { create } from 'zustand';

interface SelectedPermissionsState {
  selectedPermissions: Record<string, string[]>;
  setSelectedPermissions: (actionId: string, permissions: string[]) => void;
  setBulkSelectedPermissions: (perms: Record<string, string[]>) => void;
  resetSelectedPermissions: () => void;
  getAllSelectedPermissions: () => string[];
}

export const useSelectedPermissionsStore = create<SelectedPermissionsState>(
  (set, get) => ({
    selectedPermissions: {},

    setSelectedPermissions: (actionId, permissions) =>
      set((state) => ({
        selectedPermissions: {
          ...state.selectedPermissions,
          [actionId]: permissions,
        },
      })),

    setBulkSelectedPermissions: (perms) =>
      set({ selectedPermissions: perms }),

    resetSelectedPermissions: () => set({ selectedPermissions: {} }),

    getAllSelectedPermissions: () =>
      Object.values(get().selectedPermissions).flat(),
  }),
);
