import { type FC } from 'react';
import { Flex, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { getNavigationUrl } from '../../lib/utils';

const { Text } = Typography;

interface Props {
  isEditing: boolean;
}

export const ValidationSettingsBackNavigation: FC<Props> = () => {
  const navigate = useNavigate();
  const { settingMetadata } = useValidationSettingStore();
  const [searchParams] = useSearchParams();

  const handleBackNavigation = () => {
    const lineItemId = settingMetadata?.lineItemId;
    const redirectTo = searchParams.get('redirectTo') || undefined;
    const redirectUrl = getNavigationUrl(lineItemId, redirectTo);
    navigate(redirectUrl);
  };

  return (
    <Flex gap="0.5rem" align="center">
      <Flex
        onClick={handleBackNavigation}
        align="center"
        justify="center"
        style={{
          borderRadius: '17px',
          background: '#EBEBEB',
          height: '1.5rem',
          width: '1.5rem',
          cursor: 'pointer',
        }}>
        <ArrowLeftOutlined style={{ fontSize: '0.625rem' }} />
      </Flex>
      <Text strong>Configure Validation Settings</Text>
    </Flex>
  );
};
