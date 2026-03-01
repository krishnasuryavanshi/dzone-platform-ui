import { usePermissionCheck } from '@dzone/shared-auth';

export const useFieldPermissions = (permissions: any = {}) => {
  const view = usePermissionCheck(permissions?.view);
  const edit = usePermissionCheck(permissions?.edit);
  const create = usePermissionCheck(permissions?.create);
  return { view, edit, create };
};

export const processFieldPermissions = (
  fields: any[] = [],
  disabledFields: Record<string, boolean> = {},
) => {
  return fields.map((field) => {
    const { view, edit, create } = useFieldPermissions(field.permissions || {});
    const isEditable = view && (edit || create);
    const isReadOnly = view && !isEditable;
    const isHidden = field.hidden === true || (!create && !edit);

    return {
      ...field,
      isEditable: !isHidden && isEditable && !disabledFields[field.field],
      isReadOnly: isHidden || isReadOnly || disabledFields[field.field],
      hidden: isHidden,
    };
  });
};
