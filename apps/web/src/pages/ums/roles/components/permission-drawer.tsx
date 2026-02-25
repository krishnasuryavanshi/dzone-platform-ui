import { type FC, useEffect, useMemo, useState } from 'react';
import { Drawer, Input, Checkbox, Flex, Typography, Divider } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import type { IGroupPermissions, IPermission } from '../lib/types';
import {
  useModulesStore,
  usePermissionsStore,
  useSelectedPermissionsStore,
  useEditStore,
} from '../stores';
import { PermissionCheckbox } from './permission-checkbox';

const { Text } = Typography;

interface IPermissionDrawerProps {
  open: boolean;
  onClose: () => void;
  actionId: string;
}

export const PermissionDrawer: FC<IPermissionDrawerProps> = ({
  open,
  onClose,
  actionId,
}) => {
  const { t } = useTranslation();
  const { selectedModule, modules } = useModulesStore();
  const { allPermissions } = usePermissionsStore();
  const { selectedPermissions, setSelectedPermissions } =
    useSelectedPermissionsStore();
  const { isEditAllowed, isEditing } = useEditStore();

  const [searchTerm, setSearchTerm] = useState('');

  const actionName = useMemo(() => {
    const actions = modules?.[selectedModule as string]?.actions || [];
    return actions.find((a) => a.id === actionId)?.value || '';
  }, [selectedModule, actionId, modules]);

  const permissions: IGroupPermissions[] = allPermissions[actionId] || [];

  const filteredGroups = useMemo(
    () =>
      permissions
        .map((group) => ({
          ...group,
          filteredAttrs: group.attributes.filter((p: IPermission) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        }))
        .filter((g) => g.filteredAttrs.length > 0),
    [permissions, searchTerm],
  );

  const isAllSelected = (group: IGroupPermissions) => {
    const ids = group.attributes.map((p: IPermission) => p.id);
    return ids.every((id) => (selectedPermissions[actionId] || []).includes(id));
  };

  const handleSelectAll = (group: IGroupPermissions, checked: boolean) => {
    const current = selectedPermissions[actionId] || [];
    if (checked) {
      const allowed = group.attributes
        .filter((p: IPermission) => {
          const parentActionId = p.actionsMapping?.parentAction;
          if (!parentActionId) return true;
          return selectedPermissions[parentActionId]?.includes(p.id);
        })
        .map((p: IPermission) => p.id);
      setSelectedPermissions(actionId, [...new Set([...current, ...allowed])]);
    } else {
      const removable = group.attributes
        .filter((p: IPermission) => {
          if (p.mandatory) return false;
          const childActions = p.actionsMapping?.childrenActions;
          if (!childActions?.length) return true;
          return !childActions.some((cId) =>
            selectedPermissions[cId]?.includes(p.id),
          );
        })
        .map((p: IPermission) => p.id);
      setSelectedPermissions(
        actionId,
        current.filter((id) => !removable.includes(id)),
      );
    }
  };

  useEffect(() => {
    if (!open) setSearchTerm('');
  }, [open]);

  return (
    <Drawer
      width={500}
      placement="right"
      title={`${actionName} ${t('Permissions')}`}
      open={open}
      destroyOnClose
      maskClosable={false}
      onClose={onClose}
    >
      <Flex vertical gap="0.5rem">
        <Input
          placeholder={t('Search')}
          value={searchTerm}
          suffix={
            searchTerm ? (
              <CloseCircleOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => setSearchTerm('')}
              />
            ) : (
              <SearchOutlined />
            )
          }
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Hideable show={filteredGroups.length === 0}>
          <Text type="secondary">{t('No data available')}</Text>
        </Hideable>

        {filteredGroups.map((group, idx) => (
          <Flex key={idx} vertical gap="0.75rem">
            <Text strong style={{ paddingTop: '0.75rem' }}>
              {t(group.type)}
            </Text>

            <Hideable show={!searchTerm && group.filteredAttrs.length > 1}>
              <Checkbox
                checked={isAllSelected(group as unknown as IGroupPermissions)}
                onChange={(e) =>
                  handleSelectAll(
                    group as unknown as IGroupPermissions,
                    e.target.checked,
                  )
                }
                disabled={!isEditAllowed && isEditing}
              >
                <Text strong>{t('Select All')}</Text>
              </Checkbox>
            </Hideable>

            {group.filteredAttrs.map((permission: IPermission) => (
              <PermissionCheckbox
                key={permission.id}
                actionId={actionId}
                permission={permission}
              />
            ))}

            <Hideable show={idx < filteredGroups.length - 1}>
              <Divider style={{ margin: '0.25rem 0' }} />
            </Hideable>
          </Flex>
        ))}
      </Flex>
    </Drawer>
  );
};
