import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { IFilterDataPayload, IExecutiveFilterDataPayload } from '../lib/types';

type LoadingState = 'loading' | 'loaded';

interface DashboardStore {
  filters: IFilterDataPayload | IExecutiveFilterDataPayload;
  progress: Record<string, LoadingState>;

  updateFilters: (data: IFilterDataPayload | IExecutiveFilterDataPayload) => void;
  updateProgress: (data: Record<string, LoadingState>) => void;
  resetProgress: () => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  immer((set) => ({
    filters: {} as IFilterDataPayload | IExecutiveFilterDataPayload,
    progress: {},

    updateFilters: (data) =>
      set((state) => {
        state.filters = data;
      }),

    updateProgress: (data) =>
      set((state) => {
        state.progress = { ...state.progress, ...data };
      }),

    resetProgress: () =>
      set((state) => {
        state.progress = {};
      }),

    reset: () =>
      set((state) => {
        state.filters = {} as IFilterDataPayload | IExecutiveFilterDataPayload;
        state.progress = {};
      }),
  })),
);
