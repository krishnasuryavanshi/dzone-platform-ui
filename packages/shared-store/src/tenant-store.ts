import { create } from 'zustand';

export interface TenantTypeOption {
  id: string;
  name: string;
}

interface TenantState {
  tenantTypes: TenantTypeOption[];
  setTenantTypes: (types: TenantTypeOption[]) => void;
  clearTenantTypes: () => void;
}

/**
 * Tenant type options — fetched from organization service on demand.
 * Not persisted (re-fetched on app load).
 */
export const useTenantTypeStore = create<TenantState>((set) => ({
  tenantTypes: [],
  setTenantTypes: (types) => set({ tenantTypes: types }),
  clearTenantTypes: () => set({ tenantTypes: [] }),
}));
