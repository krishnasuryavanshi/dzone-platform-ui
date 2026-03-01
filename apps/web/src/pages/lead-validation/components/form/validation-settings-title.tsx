import { type FC } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export const ValidationSettingsTitle: FC = () => {
  const { t } = useTranslation();

  return (
    <Text style={{ fontWeight: 600 }}>
      {t('pages.leadValidationSettings.title', 'Lead Validation Settings')}
    </Text>
  );
};
