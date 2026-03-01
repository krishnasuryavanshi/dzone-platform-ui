import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface LeadsCountStore {
  totalLeads: number;
  setTotalLeads: (count: number) => void;
}

export const useLeadsCountStore = create<LeadsCountStore>()(
  immer((set) => ({
    totalLeads: 0,

    setTotalLeads: (count) =>
      set((state) => {
        state.totalLeads = count;
      }),
  })),
);
