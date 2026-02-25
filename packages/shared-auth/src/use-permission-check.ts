import { usePermissionsStore } from '@dzone/shared-store';

/**
 * Check if the current user has a specific permission.
 *
 * @example
 * const canEdit = usePermissionCheck('Campaign.EDIT');
 */
export function usePermissionCheck(permission: string): boolean {
  const { accesses } = usePermissionsStore();
  return !!accesses[permission];
}

/**
 * Check multiple permissions at once.
 *
 * @example
 * const { canView, canEdit } = usePermissionChecks({
 *   canView: 'Campaign.VIEW',
 *   canEdit: 'Campaign.EDIT',
 * });
 */
export function usePermissionChecks<T extends Record<string, string>>(
  permissions: T,
): Record<keyof T, boolean> {
  const { accesses } = usePermissionsStore();
  const result = {} as Record<keyof T, boolean>;
  for (const key in permissions) {
    result[key] = !!accesses[permissions[key]];
  }
  return result;
}
