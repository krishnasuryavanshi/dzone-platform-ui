import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchRoles,
  fetchRole,
  createRole,
  updateRole,
  updateRoleStatus,
} from '../services';
import type { IRolePermissions } from '../lib/types';

const QUERY_KEYS = {
  roles: 'roles',
  role: 'role',
} as const;

/** Paginated roles list. */
export const useRoles = (page: number, size: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.roles, page, size],
    queryFn: () => fetchRoles(page, size),
  });

/** Single role by ID (with moduleAttributes). */
export const useRole = (roleId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.role, roleId],
    queryFn: () => fetchRole(roleId!),
    enabled: !!roleId,
  });

/** Create role mutation. */
export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.roles] }),
  });
};

/** Update role mutation. */
export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      payload,
    }: {
      roleId: string;
      payload: IRolePermissions;
    }) => updateRole(roleId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.roles] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.role] });
    },
  });
};

/** Update role status mutation. */
export const useUpdateRoleStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, status }: { roleId: string; status: string }) =>
      updateRoleStatus(roleId, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.roles] }),
  });
};
