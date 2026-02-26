import { type FC } from 'react';
import { Flex, Space, Tag } from 'antd';
import { Text } from '@dzone/shared-ui';
import type { IUser } from '../../ums/users/lib/types';
import styles from './profile-items.module.css';

interface ProfileItemsProps {
  userProfile: IUser | null;
}

const capitalize = (str?: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ProfileField: FC<{ icon: string; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <Flex gap="0.5rem" vertical>
    <Flex className={styles.fieldHeader}>
      <img src={icon} alt={label} width={24} height={24} />
      <Text className={styles.fieldLabel}>{label}</Text>
    </Flex>
    {children}
  </Flex>
);

export const ProfileItems: FC<ProfileItemsProps> = ({ userProfile }) => {
  const fullName = `${capitalize(userProfile?.firstName?.trim())} ${capitalize(userProfile?.lastName)}`.trim();

  return (
    <Flex vertical className={styles.profileCard}>
      <Flex vertical gap="1rem">
        <ProfileField icon="/icons/user-name.svg" label="Name">
          <Space className={styles.fieldValue}>
            <Text className={styles.fieldText}>{fullName}</Text>
          </Space>
        </ProfileField>

        <ProfileField icon="/icons/email-address.svg" label="Email Address">
          <Space className={styles.fieldValue}>
            <Text className={styles.fieldText}>{userProfile?.username}</Text>
          </Space>
        </ProfileField>

        <ProfileField icon="/icons/tenant-type.svg" label="Tenant Type">
          <Space className={styles.fieldValue}>
            <Text className={styles.fieldText}>{userProfile?.type}</Text>
          </Space>
        </ProfileField>

        <ProfileField icon="/icons/user-role.svg" label="Roles Assigned">
          <Flex className={styles.tagContainer} wrap="wrap">
            {userProfile?.roles?.map((role) => (
              <Tag key={role.id} className={styles.tag}>{role.name}</Tag>
            ))}
          </Flex>
        </ProfileField>

        <ProfileField icon="/icons/organisations.svg" label="Associated Organisation">
          <Flex className={styles.tagContainer} wrap="wrap">
            {userProfile?.organizations?.map((org) => (
              <Tag key={org.id} className={styles.tag}>{org.name}</Tag>
            ))}
          </Flex>
        </ProfileField>
      </Flex>
    </Flex>
  );
};
