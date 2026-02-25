import { type FC, useEffect, useState } from 'react';
import { Checkbox, Tag } from 'antd';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import type { IPermission } from '../lib/types';
import {
  useEditStore,
  useSelectedPermissionsStore,
  useDependencyStore,
} from '../stores';

interface IPermissionCheckboxProps {
  actionId: string;
  permission: IPermission;
}

export const PermissionCheckbox: FC<IPermissionCheckboxProps> = ({
  actionId,
  permission,
}) => {
  const { t } = useTranslation();
  const { selectedPermissions, setSelectedPermissions } =
    useSelectedPermissionsStore();
  const { dependantPermissions } = useDependencyStore();
  const { isEditAllowed, isEditing } = useEditStore();

  const [isParentPermissionUnchecked, setIsParentPermissionUnchecked] =
    useState(false);
  const [isParentActionPermissionUnchecked, setIsParentActionPermissionUnchecked] =
    useState(false);

  useEffect(() => {
    // Check parent permission in same action
    if (permission.parent) {
      setIsParentPermissionUnchecked(
        !selectedPermissions[actionId]?.includes(permission.parent),
      );
    } else {
      setIsParentPermissionUnchecked(false);
    }

    // Check parent action's permission
    const parentActionId = permission.actionsMapping?.parentAction;
    if (parentActionId) {
      setIsParentActionPermissionUnchecked(
        !selectedPermissions[parentActionId]?.includes(permission.id),
      );
    } else {
      setIsParentActionPermissionUnchecked(false);
    }
  }, [selectedPermissions, permission]);

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      // Check if children actions have this permission checked
      const childrenActions = permission.actionsMapping?.childrenActions;
      if (childrenActions?.length) {
        const childHasIt = childrenActions.some((childActionId) =>
          selectedPermissions[childActionId]?.includes(permission.id),
        );
        if (childHasIt) {
          notification.error({
            message: t(`${permission.label} is already checked in other actions`),
          });
          return;
        }
      }
    }

    const current = selectedPermissions[actionId] || [];
    if (checked) {
      setSelectedPermissions(actionId, [...current, permission.id]);
    } else {
      const allDeps = dependantPermissions[permission.id] || [];
      const removing = [permission.id, ...allDeps];
      setSelectedPermissions(
        actionId,
        current.filter((id) => !removing.includes(id)),
      );
    }
  };

  const isChecked = (selectedPermissions[actionId] || []).includes(
    permission.id,
  );
  const isDisabled =
    permission.mandatory ||
    (!isEditAllowed && isEditing) ||
    isParentPermissionUnchecked ||
    isParentActionPermissionUnchecked;

  return (
    <Checkbox
      checked={isChecked}
      disabled={isDisabled}
      onChange={(e) => handleToggle(e.target.checked)}
    >
      {t(permission.label)}
      <Hideable show={!!permission.internal}>
        <Tag
          color="green"
          bordered={false}
          style={{ marginLeft: '0.5rem' }}
        >
          Internal
        </Tag>
      </Hideable>
    </Checkbox>
  );
};
