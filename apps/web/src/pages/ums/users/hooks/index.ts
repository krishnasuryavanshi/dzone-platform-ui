import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  activateUser,
  deactivateUser,
  adminResendSetPasswordLink,
  fetchRolesByType,
} from '../services';

const QUERY_KEYS = {
  users: 'users',
  user: 'user',
  rolesByType: 'roles-by-type',
} as const;

/** Paginated users list. */
export const useUsers = (
  page: number,
  size: number,
  roleId?: string,
  username?: string,
  org?: string,
) =>
  useQuery({
    queryKey: [QUERY_KEYS.users, page, size, roleId, username, org],
    queryFn: () => fetchUsers(page, size, roleId, username, org),
  });

/** Single user by ID. */
export const useUser = (userId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.user, userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });

/** Roles by tenant type (for user form). */
export const useRolesByType = (tenantType?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.rolesByType, tenantType],
    queryFn: () => fetchRolesByType(tenantType!),
    enabled: !!tenantType,
  });

/** Create user mutation. */
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.users] }),
  });
};

/** Update user mutation. */
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      username,
    }: {
      payload: Record<string, any>;
      username: string;
    }) => updateUser(payload, username),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
  });
};

/** Activate user mutation. */
export const useActivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: activateUser,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.users] }),
  });
};

/** Deactivate user mutation. */
export const useDeactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.users] }),
  });
};

/** Resend password link mutation. */
export const useResendPasswordLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminResendSetPasswordLink,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.users] }),
  });
};
