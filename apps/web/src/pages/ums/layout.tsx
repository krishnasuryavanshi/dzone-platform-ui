import { type FC } from 'react';
import { Tabs, Flex } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePermissionCheck } from '@dzone/shared-auth';
import { UserActionsEnum, RoleActionsEnum } from '@dzone/shared-lib';

const UMS_TABS = [
  { key: '/ums/users', label: 'Users', permission: UserActionsEnum.View },
  { key: '/ums/roles', label: 'Roles & Permissions', permission: RoleActionsEnum.View },
] as const;

export const UmsLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const canViewUsers = usePermissionCheck(UserActionsEnum.View);
  const canViewRoles = usePermissionCheck(RoleActionsEnum.View);

  const permissionMap: Record<string, boolean> = {
    [UserActionsEnum.View]: canViewUsers,
    [RoleActionsEnum.View]: canViewRoles,
  };

  const visibleTabs = UMS_TABS.filter((tab) => permissionMap[tab.permission]);

  // Determine active tab from current path
  const activeKey =
    visibleTabs.find((tab) => location.pathname.startsWith(tab.key))?.key ??
    visibleTabs[0]?.key;

  return (
    <Flex vertical style={{ height: '100%' }}>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => navigate(key)}
        items={visibleTabs.map((tab) => ({
          key: tab.key,
          label: t(tab.label),
        }))}
      />
      <Outlet />
    </Flex>
  );
};
