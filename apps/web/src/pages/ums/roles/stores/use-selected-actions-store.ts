import { create } from 'zustand';

interface SelectedActionsState {
  selectedActions: Record<string, string[]>;
  setSelectedAction: (moduleId: string, actionId: string) => void;
  setBulkSelectedActions: (actions: Record<string, string[]>) => void;
  removeSelectedAction: (moduleId: string, actionId: string) => void;
  getAllSelectedActions: () => string[];
  resetSelectedActions: () => void;
}

export const useSelectedActionsStore = create<SelectedActionsState>(
  (set, get) => ({
    selectedActions: {},

    setSelectedAction: (moduleId, actionId) =>
      set((state) => ({
        selectedActions: {
          ...state.selectedActions,
          [moduleId]: [...(state.selectedActions[moduleId] || []), actionId],
        },
      })),

    setBulkSelectedActions: (actions) =>
      set({ selectedActions: actions }),

    removeSelectedAction: (moduleId, actionId) =>
      set((state) => ({
        selectedActions: {
          ...state.selectedActions,
          [moduleId]: (state.selectedActions[moduleId] || []).filter(
            (id) => id !== actionId,
          ),
        },
      })),

    getAllSelectedActions: () => Object.values(get().selectedActions).flat(),

    resetSelectedActions: () => set({ selectedActions: {} }),
  }),
);
