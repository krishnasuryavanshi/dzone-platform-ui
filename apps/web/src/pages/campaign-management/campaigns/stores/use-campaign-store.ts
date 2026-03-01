import { create } from 'zustand';

interface CampaignStore {
  isLoading: boolean;
  showLoader: (loading: boolean) => void;
  /** Alias for showLoader, used by the list container. */
  setShowLoader: (loading: boolean) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  isLoading: false,
  showLoader: (loading: boolean) => set({ isLoading: loading }),
  setShowLoader: (loading: boolean) => set({ isLoading: loading }),
}));
