export function checkPermission(
  permission: string | string[],
  permissions:
    | Record<string, boolean>
    | Record<string, Record<string, string[]>>,
  checkAllPermissions: boolean = false,
) {
  if (!permission) {
    return false;
  }

  const permissionCheck = Array.isArray(permission) ? permission : [permission];

  const check = (perm: string) => {
    if (!perm) return false;
    const [moduleAccess = '', action = '', field = ''] = perm.split('.') || [];

    if (typeof permissions[moduleAccess] === 'object') {
      if (field) {
        return !!(permissions[moduleAccess] as Record<string, string[]>)?.[field]?.includes(action);
      } else {
        return !!(permissions[moduleAccess] as Record<string, string[]>)?.[action]?.includes('');
      }
    } else {
      return !!permissions[perm];
    }
  };

  return checkAllPermissions
    ? permissionCheck.every(check)
    : permissionCheck.some(check);
}
