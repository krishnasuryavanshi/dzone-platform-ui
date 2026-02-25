import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu } from 'antd';
import { usePermissionsStore } from '@dzone/shared-store';
import { useTranslation } from 'react-i18next';
import { menuConfig, type MenuItem } from './menu-config';
import type { MenuProps } from 'antd';

interface NavigationMenuProps {
  collapsed: boolean;
}

export const NavigationMenu = ({ collapsed }: NavigationMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accesses } = usePermissionsStore();
  const { t } = useTranslation();

  const hasPermission = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some((p) => accesses[p]);
  };

  const filterByPermission = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => hasPermission(item.permissions))
      .map((item) => ({
        ...item,
        children: item.children ? filterByPermission(item.children) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);
  };

  const filteredItems = useMemo(() => filterByPermission(menuConfig), [accesses]);

  const toAntdItems = (items: MenuItem[]): MenuProps['items'] => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: t(item.label),
      children: item.children ? toAntdItems(item.children) : undefined,
    }));
  };

  const antdItems = useMemo(() => toAntdItems(filteredItems), [filteredItems, t]);

  const findActiveKeys = () => {
    const path = location.pathname;
    let selectedKey = '';
    let openKey = '';

    const search = (items: MenuItem[], parentKey?: string) => {
      for (const item of items) {
        if (item.path && path.startsWith(item.path)) {
          selectedKey = item.key;
          if (parentKey) openKey = parentKey;
        }
        if (item.children) {
          search(item.children, item.key);
        }
      }
    };

    search(menuConfig);
    return { selectedKey, openKey };
  };

  const { selectedKey, openKey } = findActiveKeys();

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    const findPath = (items: MenuItem[]): string | undefined => {
      for (const item of items) {
        if (item.key === key && item.path) return item.path;
        if (item.children) {
          const found = findPath(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const path = findPath(menuConfig);
    if (path) navigate(path);
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedKey ? [selectedKey] : []}
      defaultOpenKeys={openKey && !collapsed ? [openKey] : []}
      items={antdItems}
      onClick={handleClick}
      style={{ borderRight: 'none' }}
    />
  );
};
