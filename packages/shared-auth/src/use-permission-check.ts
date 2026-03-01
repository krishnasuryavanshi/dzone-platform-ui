import { usePermissionsStore } from '@dzone/shared-store';

/**
 * Check if the current user has a specific permission or set of permissions.
 *
 * @example
 * const canEdit = usePermissionCheck('Campaign.EDIT');
 * const canUpload = usePermissionCheck(['Leads.VIEW', 'Leads.UPLOAD'], true); // all required
 * const canAct = usePermissionCheck(['Leads.RETURN', 'Leads.PUBLISH']); // any matches
 */
export function usePermissionCheck(
  permission: string | string[],
  requireAll?: boolean,
): boolean {
  const { accesses } = usePermissionsStore();
  if (typeof permission === 'string') {
    return !!accesses[permission];
  }
  if (requireAll) {
    return permission.every((p) => !!accesses[p]);
  }
  return permission.some((p) => !!accesses[p]);
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
