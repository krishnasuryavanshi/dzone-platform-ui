import { usePermissionsStore } from '@dzone/shared-store';

/**
 * Check field-level (attribute-level) permissions for a module.
 *
 * @example
 * const fieldPerms = useFieldPermission('Campaign');
 * const canEditName = fieldPerms.hasAccess('name', 'EDIT');
 */
export function useFieldPermission(moduleName: string) {
  const { attributes } = usePermissionsStore();
  const moduleAttrs = attributes[moduleName] ?? {};

  const hasAccess = (fieldName: string, action: string): boolean => {
    const fieldAccesses = moduleAttrs[fieldName];
    return Array.isArray(fieldAccesses) && fieldAccesses.includes(action);
  };

  const getFieldAccesses = (fieldName: string): string[] => {
    return moduleAttrs[fieldName] ?? [];
  };

  return { hasAccess, getFieldAccesses };
}
