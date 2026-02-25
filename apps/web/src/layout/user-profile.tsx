import { useState } from 'react';
import { Avatar, Popover, Button, Flex, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { logout } from '@dzone/shared-auth';
import { useTranslation } from 'react-i18next';
import styles from './user-profile.module.css';

const { Text } = Typography;

export const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [logoutInProgress, setLogoutInProgress] = useState(false);

  const handleLogout = async () => {
    setLogoutInProgress(true);
    await logout();
    navigate('/login', { replace: true });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
      user.username?.[0]?.toUpperCase() ||
      'U'
    : 'U';

  const content = (
    <div className={styles.menu}>
      <Button className={styles.menuItem} type="text" block onClick={handleProfileClick}>
        <img src="/icons/user.svg" alt="" width={16} height={16} />
        <Text className={styles.menuItemText}>
          {t('layout.profile', 'Profile')}
        </Text>
      </Button>

      <Button className={styles.menuItem} type="text" block>
        <img src="/icons/settings.svg" alt="" width={16} height={16} />
        <Text className={styles.menuItemText}>
          {t('layout.settings', 'Settings')}
        </Text>
      </Button>

      <div className={styles.divider} />

      <Button
        className={styles.menuItem}
        type="text"
        block
        danger
        disabled={logoutInProgress}
        onClick={handleLogout}
      >
        <LogoutOutlined style={{ fontSize: 16 }} />
        <Text className={styles.menuItemText} type="danger">
          {t('layout.logout', 'Logout')}
        </Text>
      </Button>
    </div>
  );

  return (
    <Popover placement="bottomRight" title={user?.name ?? user?.username ?? ''} content={content}>
      <Flex align="center" gap="0.5rem" style={{ cursor: 'pointer', marginLeft: '0.5rem' }}>
        <Avatar style={{ backgroundColor: 'rgb(239, 244, 253)', color: 'rgb(50, 49, 49)' }}>
          {initials}
        </Avatar>
      </Flex>
    </Popover>
  );
};
