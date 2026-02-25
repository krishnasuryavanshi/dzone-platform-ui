import { apiClient } from '@dzone/shared-auth';
import { ApiHost } from '@dzone/shared-lib';
import type { IRolePermissions } from '../lib/types';

const BASE = ApiHost.RBACService;

/** Fetch paginated roles list. */
export async function fetchRoles(page: number, size: number) {
  const { data } = await apiClient.get(`${BASE}/roles`, {
    params: { page, size },
  });
  return data;
}

/** Fetch a single role by ID (includes moduleAttributes). */
export async function fetchRole(roleId: string) {
  const { data } = await apiClient.get(`${BASE}/roles/${roleId}`);
  return data;
}

/** Create a new role with permissions. */
export async function createRole(payload: IRolePermissions) {
  const { data } = await apiClient.post(`${BASE}/roles`, payload);
  return data;
}

/** Update a role and its permissions. */
export async function updateRole(roleId: string, payload: IRolePermissions) {
  const { data } = await apiClient.put(`${BASE}/roles/${roleId}`, payload);
  return data;
}

/** Update role status (activate/deactivate). */
export async function updateRoleStatus(roleId: string, status: string) {
  const { data } = await apiClient.post(`${BASE}/roles/update-status`, null, {
    params: { roleId, status },
  });
  return data;
}

/** Fetch all available modules (for role form). */
export async function fetchAllModules() {
  const { data } = await apiClient.get(`${BASE}/modules`);
  return data;
}

/** Fetch permissions for a specific action in a module. */
export async function fetchPermissionsByActionId(
  actionId: string,
  moduleId: string,
) {
  const { data } = await apiClient.get(
    `${BASE}/attributes/module/${moduleId}/action/${actionId}`,
  );
  return data;
}
