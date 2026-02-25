import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser, IRole, ModuleAccess } from './types';

interface AuthState {
  user: IUser | null;
  roles: IRole[];
  tenantCode: string[];
  tenantType: string;
  isDzoneUser: boolean;
  moduleAccessList: ModuleAccess[];
  isAuthenticated: boolean;

  setAuth: (data: {
    user: IUser;
    roles: IRole[];
    tenantCode: string[];
    tenantType: string;
    isDzoneUser: boolean;
    moduleAccessList: ModuleAccess[];
  }) => void;
  clearAuth: () => void;
}

const initialState = {
  user: null,
  roles: [],
  tenantCode: [],
  tenantType: '',
  isDzoneUser: false,
  moduleAccessList: [],
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (data) =>
        set({
          user: data.user,
          roles: data.roles,
          tenantCode: data.tenantCode,
          tenantType: data.tenantType,
          isDzoneUser: data.isDzoneUser,
          moduleAccessList: data.moduleAccessList,
          isAuthenticated: true,
        }),

      clearAuth: () => set(initialState),
    }),
    {
      name: 'dzone-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        roles: state.roles,
        tenantCode: state.tenantCode,
        tenantType: state.tenantType,
        isDzoneUser: state.isDzoneUser,
        moduleAccessList: state.moduleAccessList,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
