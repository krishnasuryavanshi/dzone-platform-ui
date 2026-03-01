import { usePermissionCheck } from '@dzone/shared-auth';
import { IPermission } from '../types';

export const useFieldPermissions = (permissions: IPermission) => {
  const viewPermissionKey = usePermissionCheck(permissions?.view?.toString());
  const createPermissionKey = usePermissionCheck(permissions?.create?.toString());
  const editPermissionKey = usePermissionCheck(permissions?.edit?.toString());

  if (!permissions) {
    return {
      createPermissionKey: false,
      editPermissionKey: false,
      viewPermissionKey: false,
    };
  }

  return { createPermissionKey, editPermissionKey, viewPermissionKey };
};
