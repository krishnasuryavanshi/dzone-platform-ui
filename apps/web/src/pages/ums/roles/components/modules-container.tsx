import { type FC, useEffect, useMemo, useState } from 'react';
import { Flex, Tabs, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { IRoleDetails } from '../lib/types';
import {
  useModulesStore,
  useEditStore,
  usePermissionsStore,
  useSelectedPermissionsStore,
} from '../stores';
import { ActionItem } from './action-item';
import type { IAction } from '../lib/types';

const { Text } = Typography;

interface IModulesContainerProps {
  roleDetails?: IRoleDetails;
}

export const ModulesContainer: FC<IModulesContainerProps> = ({
  roleDetails: _roleDetails,
}) => {
  const { t } = useTranslation();
  const {
    modules,
    selectedModule,
    selectedModuleId,
    setSelectedModule,
    setSelectedModuleId,
    fetchModules,
    getActionsForModule,
  } = useModulesStore();
  const { isEditing } = useEditStore();
  const { fetchAllPermissions } = usePermissionsStore();
  const { selectedPermissions } = useSelectedPermissionsStore();

  const [actions, setActions] = useState<IAction[]>([]);

  useEffect(() => {
    fetchModules();
  }, []);

  // Set first module as default once modules load
  useEffect(() => {
    if (modules && !selectedModule) {
      const firstKey = Object.keys(modules)[0];
      if (firstKey) {
        setSelectedModule(firstKey);
        setSelectedModuleId(modules[firstKey].id);
      }
    }
  }, [modules]);

  // Load actions when selected module changes
  useEffect(() => {
    if (selectedModule) {
      const moduleActions = getActionsForModule(selectedModule);
      setActions(moduleActions);

      // For editing: preload permissions for active actions
      if (isEditing) {
        const activeActions = moduleActions
          .filter(({ id }) => selectedPermissions[id]?.length > 0)
          .map(({ id, dependsOnAction, children }) => ({
            id,
            dependsOnAction,
            children,
          }));

        if (activeActions.length > 0) {
          activeActions.forEach(({ id, dependsOnAction, children }) =>
            fetchAllPermissions(
              id,
              selectedModuleId as string,
              dependsOnAction,
              children,
            ),
          );
        }
      }
    }
  }, [selectedModule, isEditing]);

  const handleTabClick = (tab: string) => {
    if (!modules) return;
    setSelectedModule(tab);
    setSelectedModuleId(modules[tab].id);
  };

  const tabItems = useMemo(() => {
    if (!modules) return [];
    return Object.values(modules).map((mod) => ({
      key: mod.name,
      label: t(mod.name),
      children: (
        <Flex vertical gap="0.75rem">
          <Text strong>{t('Give permissions to the actions')}</Text>
          <Flex
            vertical
            gap="0.75rem"
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              width: '75%',
            }}
          >
            {actions.map((action, idx) => (
              <ActionItem
                key={action.id}
                action={action}
                isLast={idx === actions.length - 1}
              />
            ))}
          </Flex>
        </Flex>
      ),
    }));
  }, [modules, actions, t]);

  if (!modules) return null;

  return (
    <Flex vertical gap="0.75rem" style={{ minHeight: '40vh' }}>
      <Text strong>{t('Give permissions to the modules')}</Text>
      <Tabs
        className="role-modules-tabs"
        tabPosition="left"
        activeKey={selectedModule ?? undefined}
        onChange={handleTabClick}
        items={tabItems}
        destroyInactiveTabPane
      />
    </Flex>
  );
};
