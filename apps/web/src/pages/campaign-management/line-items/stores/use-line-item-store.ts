import { create } from 'zustand';
import { ILineItem, IStatusPicklist } from '../lib/types';
import { fetchStatusPicklist } from '../services';

interface LineItemStore {
  value: Record<string, string>;
  setValue: (value: Record<string, string>) => void;
  lineItem: ILineItem | null;
  setLineItem: (lineItem: ILineItem | null) => void;
  isLoading: boolean;
  showLoader: (loading: boolean) => void;
  updateList: ILineItem | undefined;
  setUpdateList: (item: ILineItem | undefined) => void;
  statusList: IStatusPicklist[];
  setStatusList: (list: IStatusPicklist[]) => void;
  fetchStatusData: () => Promise<void>;
  reset: () => void;
  // Internal state for tracking unsaved changes
  _sourceObject: Record<string, any>;
  _targetObject: Record<string, any>;
  // TODO: These methods are used by create-line-item components; full implementation pending migration
  setSourceObject: (obj: Record<string, any>) => void;
  updateTargetObject: (obj: Record<string, any>) => void;
  clearUnsavedData: () => void;
}

const initialState = {
  value: {} as Record<string, string>,
  lineItem: null as ILineItem | null,
  isLoading: false,
  updateList: undefined as ILineItem | undefined,
  statusList: [] as IStatusPicklist[],
  _sourceObject: {} as Record<string, any>,
  _targetObject: {} as Record<string, any>,
};

export const useLineItemStore = create<LineItemStore>((set) => ({
  ...initialState,

  setValue: (value) => set({ value }),
  setLineItem: (lineItem) => set({ lineItem }),
  showLoader: (loading) => set({ isLoading: loading }),
  setUpdateList: (item) => set({ updateList: item }),
  setStatusList: (list) => set({ statusList: list }),

  fetchStatusData: async () => {
    const data = await fetchStatusPicklist();
    set({ statusList: data as unknown as IStatusPicklist[] });
  },

  setSourceObject: (obj) => set({ _sourceObject: obj }),
  updateTargetObject: (obj) => set({ _targetObject: obj }),
  clearUnsavedData: () => set({ _sourceObject: {}, _targetObject: {} }),

  reset: () => set(initialState),
}));
