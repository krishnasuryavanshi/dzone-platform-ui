import { type FC } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Flex, Typography, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useOrganization } from '../hooks';
import { OrgForm } from './org-form';

const { Text } = Typography;

/** Create or edit organization page content. */
export const OrgFormPage: FC = () => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const isEditing = !!organizationId;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading } = useOrganization(organizationId);
  const organization = data?.data ?? data;

  if (isEditing && isLoading) return <Spin />;
  if (isEditing && !organization) return null;

  return (
    <Flex vertical gap="1rem" style={{ height: '100%', padding: '1rem' }}>
      <Text strong>{t('Organizations')}</Text>
      <Flex
        gap="0.5rem"
        align="center"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/organizations')}
      >
        <ArrowLeftOutlined />
        <Text strong>
          {isEditing ? t('Edit Details') : t('Create New Organization')}
        </Text>
      </Flex>
      <OrgForm isEditing={isEditing} organization={organization} />
    </Flex>
  );
};

export default OrgFormPage;
