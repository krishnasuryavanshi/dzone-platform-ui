import { useState } from 'react';
import { Layout, Flex, Typography, theme } from 'antd';
import { NavigationMenu } from './navigation-menu';
import styles from './layout.module.css';

const { Sider: AntSider } = Layout;
const { Text } = Typography;

const SIDER_WIDTH = '13.75rem';
const COLLAPSED_WIDTH = '3.5rem';

interface SiderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onBreakpoint: (broken: boolean) => void;
}

export const Sider = ({ collapsed, onCollapse, onBreakpoint }: SiderProps) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const [isMobile, setIsMobile] = useState(false);

  const handleBreakpoint = (broken: boolean) => {
    setIsMobile(broken);
    onBreakpoint(broken);
  };

  return (
    <>
      {isMobile && !collapsed && (
        <div className={styles.mobileOverlay} onClick={() => onCollapse(true)} />
      )}
      <AntSider
        className={styles.sider}
        style={{
          borderRadius,
          visibility: !isMobile || !collapsed ? 'visible' : 'hidden',
        }}
        width={SIDER_WIDTH}
        collapsedWidth={COLLAPSED_WIDTH}
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={handleBreakpoint}
      >
        <Flex
          align="center"
          justify="flex-start"
          gap="1rem"
          style={{ height: '3.5rem', padding: '1rem' }}
        >
          <span
            onClick={() => onCollapse(!collapsed)}
            style={{ cursor: 'pointer', paddingTop: '0.5rem' }}
          >
            <img
              src={collapsed ? '/icons/menus/menu-collapsed.svg' : '/icons/menus/menu-expanded.svg'}
              alt=""
              width={24}
              height={24}
            />
          </span>
          {!collapsed && (
            <Text style={{ fontWeight: 450, fontSize: '1.625rem', color: '#fff' }}>
              DZ One
            </Text>
          )}
        </Flex>
        <div className={styles.menuWrapper}>
          <NavigationMenu collapsed={collapsed} />
        </div>
      </AntSider>
    </>
  );
};
