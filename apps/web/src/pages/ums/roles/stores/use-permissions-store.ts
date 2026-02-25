import { create } from 'zustand';
import type { IGroupPermissions, IPermission } from '../lib/types';
import { fetchPermissionsByActionId } from '../services';
import { useDependencyStore } from './use-dependency-store';

interface PermissionsState {
  allPermissions: Record<string, IGroupPermissions[]>;
  fetchAllPermissions: (
    actionId: string,
    moduleId: string,
    parentActionId?: string,
    childrenActionIds?: string[],
  ) => Promise<IGroupPermissions[]>;
  resetPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  allPermissions: {},

  fetchAllPermissions: async (
    actionId,
    moduleId,
    parentActionId,
    childrenActionIds,
  ) => {
    // Return cached if available
    if (get().allPermissions[actionId]) {
      return get().allPermissions[actionId];
    }

    try {
      const response = await fetchPermissionsByActionId(actionId, moduleId);
      const data: IGroupPermissions[] = response?.data ?? response ?? [];

      const permissionDeps: Record<string, string[]> = {};
      data.forEach((group) => {
        group.attributes.forEach((permission: IPermission) => {
          permission.actionsMapping = {
            parentAction: parentActionId,
            childrenActions: childrenActionIds,
          };
          if (permission.children?.length) {
            permissionDeps[permission.id] = permission.children;
          }
        });
      });

      useDependencyStore.getState().setDependantPermissions(permissionDeps);

      set((state) => ({
        allPermissions: { ...state.allPermissions, [actionId]: data },
      }));

      return data;
    } catch {
      return [];
    }
  },

  resetPermissions: () => set({ allPermissions: {} }),
}));
