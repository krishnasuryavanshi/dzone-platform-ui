import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IFieldDataProps, ModuleAccess } from './types';

interface PermissionsState {
  modules: ModuleAccess[];
  accesses: Record<string, boolean>;
  attributes: Record<string, Record<string, string[]>>;

  setModules: (modules: ModuleAccess[]) => void;
  setAccesses: (accesses: Record<string, boolean>) => void;
  setAttributes: (fieldData: IFieldDataProps[]) => void;
  clearPermissions: () => void;
}

/**
 * Flattens a module access list into a { "Module.Action": true } map.
 */
export function flattenModuleAccesses(modules: ModuleAccess[]): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const item of modules) {
    const moduleName = item.module.name;
    const accesses = Array.isArray(item.module.access) ? item.module.access : [];
    for (const access of accesses) {
      result[`${moduleName}.${access}`] = true;
    }
  }
  return result;
}

export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set) => ({
      modules: [],
      accesses: {},
      attributes: {},

      setModules: (modules) => set({ modules }),

      setAccesses: (accesses) => set({ accesses }),

      setAttributes: (fieldData) => {
        if (!fieldData?.length) return;
        set((state) => {
          const updatedAttributes = { ...state.attributes };
          for (const mod of fieldData) {
            if (!mod.moduleName) continue;
            const modulePermissions: Record<string, string[]> = {};
            for (const attr of mod.attributes) {
              modulePermissions[attr.name] = attr.accesses;
            }
            updatedAttributes[mod.moduleName] = modulePermissions;
          }
          return { attributes: updatedAttributes };
        });
      },

      clearPermissions: () => {
        set({ modules: [], accesses: {}, attributes: {} });
      },
    }),
    {
      name: 'permissions-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
