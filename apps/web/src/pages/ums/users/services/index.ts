import { apiClient } from '@dzone/shared-auth';
import { ApiHost } from '@dzone/shared-lib';
const BASE = ApiHost.RBACService;

/** Fetch paginated users list. */
export async function fetchUsers(
  page: number,
  size: number,
  roleId?: string,
  username?: string,
  org?: string,
) {
  const params: Record<string, string | number> = { page, size };
  if (roleId) params.roleId = roleId;
  if (username) params.username = username;
  if (org) params.orgId = org;

  const { data } = await apiClient.get(`${BASE}/users/paginated`, { params });
  return data;
}

/** Fetch a single user by ID. */
export async function fetchUser(userId: string) {
  const { data } = await apiClient.get(`${BASE}/users/${userId}`);
  return data;
}

/** Create a new user. */
export async function createUser(payload: Record<string, any>) {
  const { data } = await apiClient.post(`${BASE}/users/paginated`, payload);
  return data;
}

/** Update an existing user. */
export async function updateUser(
  payload: Record<string, any>,
  username: string,
) {
  const { data } = await apiClient.put(
    `${BASE}/users/update-user/${username}`,
    payload,
  );
  return data;
}

/** Activate user. */
export async function activateUser(username: string) {
  const { data } = await apiClient.put(
    `${BASE}/users/activate-user/${username}`,
  );
  return data;
}

/** Deactivate user. */
export async function deactivateUser(username: string) {
  const { data } = await apiClient.put(
    `${BASE}/users/deactivate-user/${username}`,
  );
  return data;
}

/** Admin resend set password link. */
export async function adminResendSetPasswordLink(username: string) {
  const { data } = await apiClient.put(
    `${BASE}/users/send-mail/${username}`,
  );
  return data;
}

/** Fetch roles by tenant type (for user form). */
export async function fetchRolesByType(tenantType: string) {
  const { data } = await apiClient.get(
    `${BASE}/roles/types/${tenantType}`,
  );
  return data;
}

/** Fetch users with module access. */
export async function fetchUsersWithModuleAccess(
  moduleName: string,
  tenantCode: string,
) {
  const { data } = await apiClient.get(
    `${BASE}/modules/${moduleName}/users`,
    { params: { tenantCode } },
  );
  return data;
}

/** Fetch assigned users in module. */
export async function fetchAssignedUsersInModule(moduleName: string) {
  const { data } = await apiClient.get(
    `${BASE}/modules/${moduleName}/assigned/users`,
  );
  return data;
}
