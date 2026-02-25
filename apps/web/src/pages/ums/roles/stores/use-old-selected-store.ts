import { create } from 'zustand';

interface OldSelectedState {
  oldSelectedPermissions: string[];
  setOldSelectedPermissions: (permissions: string[]) => void;
  oldSelectedActions: string[];
  setOldSelectedActions: (actions: string[]) => void;
  resetOldSelectedStores: () => void;
}

export const useOldSelectedStore = create<OldSelectedState>((set) => ({
  oldSelectedPermissions: [],
  oldSelectedActions: [],

  setOldSelectedPermissions: (permissions) =>
    set({ oldSelectedPermissions: permissions }),

  setOldSelectedActions: (actions) =>
    set({ oldSelectedActions: actions }),

  resetOldSelectedStores: () =>
    set({ oldSelectedPermissions: [], oldSelectedActions: [] }),
}));
