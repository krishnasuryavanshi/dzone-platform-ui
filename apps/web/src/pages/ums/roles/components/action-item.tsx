import { type FC, useEffect, useState } from 'react';
import { Flex, Switch, Typography, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import type { IAction, IGroupPermissions, IPermission } from '../lib/types';
import {
  useEditStore,
  useModulesStore,
  usePermissionsStore,
  useSelectedActionsStore,
  useSelectedPermissionsStore,
  useDependencyStore,
} from '../stores';
import { PermissionDrawer } from './permission-drawer';

const { Link } = Typography;

interface IActionItemProps {
  action: IAction;
  isLast: boolean;
}

export const ActionItem: FC<IActionItemProps> = ({ action, isLast }) => {
  const { t } = useTranslation();
  const { isEditing, isEditAllowed } = useEditStore();
  const { selectedModuleId } = useModulesStore();
  const { setSelectedAction, removeSelectedAction, selectedActions } =
    useSelectedActionsStore();
  const { selectedPermissions, setSelectedPermissions } =
    useSelectedPermissionsStore();
  const { allPermissions, fetchAllPermissions } = usePermissionsStore();
  const { dependantActions } = useDependencyStore();

  const [isChecked, setIsChecked] = useState(false);
  const [isParentChecked, setIsParentChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const moduleId = selectedModuleId as string;

  useEffect(() => {
    const moduleActions = selectedActions[moduleId] || [];
    setIsChecked(moduleActions.includes(action.id));

    // Check parent dependency
    if (action.dependsOnAction) {
      setIsParentChecked(moduleActions.includes(action.dependsOnAction));
    } else {
      setIsParentChecked(true);
    }
  }, [selectedActions, moduleId, action]);

  useEffect(() => {
    const perms = allPermissions[action.id];
    const hasPerm = perms?.some(
      (g: IGroupPermissions) => g.attributes?.length > 0,
    );
    setHasPermissions(!!hasPerm);
  }, [allPermissions, action.id]);

  const onToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      if (checked) {
        setSelectedAction(moduleId, action.id);
        const permissions = await fetchAllPermissions(
          action.id,
          moduleId,
          action.dependsOnAction,
          action.children,
        );
        // Auto-select permissions that are allowed based on parent action
        const permissionIds = permissions.flatMap((group: IGroupPermissions) =>
          group.attributes
            .filter((perm: IPermission) => {
              if (perm.actionsMapping?.parentAction) {
                return selectedPermissions[
                  perm.actionsMapping.parentAction
                ]?.includes(perm.id);
              }
              return true;
            })
            .map((perm: IPermission) => perm.id),
        );
        setSelectedPermissions(action.id, permissionIds);
      } else {
        removeSelectedAction(moduleId, action.id);
        setSelectedPermissions(action.id, []);
        switchOffDependents(action.id);
      }
    } catch {
      // silent
    }
    setIsLoading(false);
  };

  const switchOffDependents = (actionId: string) => {
    const deps = dependantActions[actionId];
    if (deps?.length) {
      deps.forEach((depId) => {
        removeSelectedAction(moduleId, depId);
        setSelectedPermissions(depId, []);
        switchOffDependents(depId);
      });
    }
  };

  return (
    <>
      <Flex vertical gap="0.75rem">
        <Flex align="center" justify="space-between">
          <Flex gap="0.75rem" align="center">
            {isLoading ? (
              <LoadingOutlined />
            ) : (
              <Switch
                checked={isChecked}
                onChange={onToggle}
                disabled={(!isEditAllowed && isEditing) || !isParentChecked}
                size="small"
              />
            )}
            <span>{action.name || action.value}</span>
          </Flex>
          <Hideable show={hasPermissions && isParentChecked}>
            <Link
              disabled={!isChecked}
              style={{
                textDecoration: isChecked ? 'underline' : 'none',
                cursor: isChecked ? 'pointer' : 'default',
              }}
              onClick={() => isChecked && setDrawerOpen(true)}
            >
              {t('Customize')}
            </Link>
          </Hideable>
        </Flex>
        <Hideable show={!isLast}>
          <Divider style={{ margin: 0 }} />
        </Hideable>
      </Flex>
      <PermissionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        actionId={action.id}
      />
    </>
  );
};
