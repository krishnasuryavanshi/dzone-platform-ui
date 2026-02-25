import { Suspense, useState } from 'react';
import { Outlet } from 'react-router';
import { Layout, Spin } from 'antd';
import { Sider } from './sider';
import { AppHeader } from './header';
import styles from './layout.module.css';

const { Content } = Layout;

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Layout className={styles.root}>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        onBreakpoint={setIsMobile}
      />
      <Layout className={isMobile ? styles.panelMobile : styles.panelDesktop}>
        <AppHeader />
        <Content className={styles.content}>
          <Suspense
            fallback={
              <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }} />
            }
          >
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
