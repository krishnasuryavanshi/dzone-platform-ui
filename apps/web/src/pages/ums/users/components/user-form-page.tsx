import { Flex, Typography, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useUser } from '../hooks';
import { UserForm } from './user-form';

const { Text } = Typography;

export default function UserFormPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditing = !!userId;

  const { data, isLoading } = useUser(userId);
  const user = data?.data ?? data;

  if (isEditing && isLoading) {
    return (
      <Flex justify="center" align="center" style={{ padding: '2rem' }}>
        <Spin />
      </Flex>
    );
  }

  if (isEditing && !user) {
    return (
      <Flex justify="center" style={{ padding: '2rem' }}>
        <Text type="secondary">{t('User not found')}</Text>
      </Flex>
    );
  }

  return (
    <Flex vertical gap="1rem" style={{ height: '100%' }}>
      <Flex gap="0.75rem" align="center">
        <ArrowLeftOutlined
          onClick={() => navigate('/ums/users')}
          style={{ cursor: 'pointer' }}
        />
        <Text strong>{isEditing ? t('Edit User') : t('Create User')}</Text>
      </Flex>
      <UserForm isEditing={isEditing} user={user} />
    </Flex>
  );
}
