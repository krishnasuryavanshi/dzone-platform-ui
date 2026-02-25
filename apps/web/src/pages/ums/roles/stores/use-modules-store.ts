import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { IAction, IModule } from '../lib/types';
import { fetchAllModules } from '../services';
import { useDependencyStore } from './use-dependency-store';

interface ModulesState {
  modules: Record<string, IModule> | null;
  selectedModule: string | null;
  selectedModuleId: string | null;
  setSelectedModule: (name: string) => void;
  setSelectedModuleId: (id: string) => void;
  fetchModules: () => Promise<void>;
  getActionsForModule: (moduleName: string | null) => IAction[];
  resetModules: () => void;
}

export const useModulesStore = create<ModulesState>()(
  immer((set, get) => ({
    modules: null,
    selectedModule: null,
    selectedModuleId: null,

    setSelectedModule: (name) => set({ selectedModule: name }),
    setSelectedModuleId: (id) => set({ selectedModuleId: id }),

    fetchModules: async () => {
      try {
        const response = await fetchAllModules();
        const rawModules: IModule[] = response?.data ?? response ?? [];

        const actionDeps: Record<string, string[]> = {};
        const modulesMap = rawModules.reduce(
          (acc, mod) => {
            mod.actions.forEach((action) => {
              if (action.children?.length) {
                actionDeps[action.id] = action.children;
              }
            });
            acc[mod.name] = mod;
            return acc;
          },
          {} as Record<string, IModule>,
        );

        useDependencyStore.getState().setDependantAction(actionDeps);
        set({ modules: modulesMap });
      } catch {
        // silent fail
      }
    },

    getActionsForModule: (moduleName) => {
      const mod = get().modules?.[moduleName ?? ''];
      if (!mod) return [];
      return [...mod.actions];
    },

    resetModules: () =>
      set({ modules: null, selectedModule: null, selectedModuleId: null }),
  })),
);
