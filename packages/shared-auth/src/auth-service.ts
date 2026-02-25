import { apiClient } from './api-client';
import {
  useAuthStore,
  useTokenStore,
  usePermissionsStore,
  flattenModuleAccesses,
  clearUserStorage,
  type IUser,
  type IRole,
  type ModuleAccess,
} from '@dzone/shared-store';

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  accessToken: string;
  tenantCode: string[];
  isDzoneUser: boolean;
  roles: IRole[];
  modules: ModuleAccess[];
  userId: string;
  type: string;
  name?: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

/**
 * Authenticate the user with email/password.
 * Sets auth, token, and permissions stores on success.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<{ data: LoginResponse }>(
    '/api/rbac-service/auth/login',
    { username: payload.email, password: payload.password },
  );

  const result = data.data ?? (data as unknown as LoginResponse);

  const user: IUser = {
    userId: result.userId,
    email: result.email,
    username: result.username,
    firstName: result.firstName,
    lastName: result.lastName,
    name: result.name || `${result.firstName} ${result.lastName}`,
  };

  // Set auth store
  useAuthStore.getState().setAuth({
    user,
    roles: result.roles,
    tenantCode: result.tenantCode,
    tenantType: result.type,
    isDzoneUser: result.isDzoneUser,
    moduleAccessList: result.modules,
  });

  // Persist token (localStorage if remember, sessionStorage otherwise)
  useTokenStore.getState().setToken(result.accessToken, payload.remember);

  // Flatten module permissions and store
  const accesses = flattenModuleAccesses(result.modules);
  usePermissionsStore.getState().setModules(result.modules);
  usePermissionsStore.getState().setAccesses(accesses);

  return result;
}

/**
 * Log out the user. Calls backend logout endpoint, then clears all stores.
 */
export async function logout(): Promise<void> {
  const userId = useAuthStore.getState().user?.userId;

  try {
    await apiClient.post('/api/rbac-service/auth/logout');
  } catch {
    // Silent — logout should always clear local state even if backend fails
  }

  useAuthStore.getState().clearAuth();
  useTokenStore.getState().clearToken();
  usePermissionsStore.getState().clearPermissions();

  if (userId) {
    clearUserStorage(userId);
  }
}
