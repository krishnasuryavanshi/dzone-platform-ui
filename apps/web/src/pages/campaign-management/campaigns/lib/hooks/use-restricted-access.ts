import {
  RestrictedAccessKeys,
  Roles,
  RestrictedAccessPermissions,
} from '@dzone/shared-lib';
import { useAuthStore } from '@dzone/shared-store';

/**
 * Checks whether the current user's role is restricted from accessing a feature.
 * Returns `true` if the user's role is listed in the restricted roles for the given key.
 *
 * TODO: Move this hook to @dzone/shared-auth once useRestrictedAccess is available there.
 */
export function useRestrictedAccess(
  accessKey: RestrictedAccessKeys,
): boolean {
  const { roles } = useAuthStore();

  const restrictedRoles: Roles[] =
    (RestrictedAccessPermissions as Record<string, Roles[]>)[accessKey] || [];

  if (!restrictedRoles.length) return false;

  const userRoleNames = roles.map((r) => r.name);
  const isRestricted = restrictedRoles.some((role) =>
    userRoleNames.includes(role),
  );

  return isRestricted;
}
