import { create } from 'zustand';

interface DependencyState {
  dependantActions: Record<string, string[]>;
  setDependantAction: (deps: Record<string, string[]>) => void;
  dependantPermissions: Record<string, string[]>;
  setDependantPermissions: (deps: Record<string, string[]>) => void;
}

export const useDependencyStore = create<DependencyState>((set, get) => ({
  dependantActions: {},
  dependantPermissions: {},

  setDependantAction: (deps) => set({ dependantActions: deps }),

  setDependantPermissions: (deps) =>
    set({ dependantPermissions: { ...get().dependantPermissions, ...deps } }),
}));
