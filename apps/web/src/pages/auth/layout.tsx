import { Outlet, Navigate } from 'react-router';
import { ConfigProvider, Flex, Typography } from 'antd';
import { useAuthStore } from '@dzone/shared-store';
import { authTheme } from '@dzone/shared-styles';
import { useTranslation } from 'react-i18next';
import styles from './layout.module.css';

const { Text, Title } = Typography;

export const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <ConfigProvider theme={authTheme}>
      <Flex
        vertical
        justify="space-between"
        align="center"
        gap="3rem"
        className={styles.container}
      >
        {/* Tagline */}
        <Text className={styles.tagline}>
          {t('pages.demandGenHelper', 'Your Demand Gen Helper')}
        </Text>

        {/* Card */}
        <Flex
          vertical
          justify="space-between"
          align="center"
          gap="3rem"
          className={styles.card}
        >
          {/* Heading */}
          <Flex vertical align="center" gap="0.5rem" style={{ position: 'relative' }}>
            <Title
              style={{
                color: '#fff',
                fontSize: '2.5rem',
                fontWeight: 500,
                textAlign: 'center',
                margin: '0 0 0.5rem 0',
              }}
            >
              {t('pages.welcomeMessage', 'Welcome to')}
            </Title>
            <Flex align="center" gap="0.5rem">
              <span className={styles.brandPill}>DZ One</span>
              <div className={styles.gradientDot} />
            </Flex>
          </Flex>

          {/* Form area */}
          <Flex
            vertical
            justify="center"
            align="center"
            style={{ width: '100%' }}
          >
            <Outlet />
          </Flex>
        </Flex>

        {/* Powered by + Digitalzone logo */}
        <Flex vertical align="center">
          <Text className={styles.poweredBy}>
            {t('pages.poweredBy', 'Powered by')}
          </Text>
          <img
            src="/images/brands/digitalzone-full-white.svg"
            alt="Digitalzone"
            className={styles.brandLogo}
          />
        </Flex>

        {/* Copyright */}
        <Text className={styles.copyright}>
          {t('pages.copyright', '\u00A9 2024 Digitalzone. All rights reserved.')}
        </Text>
      </Flex>
    </ConfigProvider>
  );
};
