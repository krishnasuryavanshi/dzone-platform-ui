import { type FC } from 'react';
import { Spin, Flex, Typography } from 'antd';
import { useAuthStore } from '@dzone/shared-store';
import { useUser } from '../../ums/users/hooks';
import { ProfileItems } from './profile-items';

const { Text } = Typography;

export const ProfileContainer: FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useUser(user?.userId);

  if (isLoading) return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }} />;

  return (
    <Flex vertical gap="1rem" style={{ padding: '1rem' }}>
      <Text strong style={{ fontSize: '1.125rem' }}>Your Profile</Text>
      <ProfileItems userProfile={data?.data ?? null} />
    </Flex>
  );
};
