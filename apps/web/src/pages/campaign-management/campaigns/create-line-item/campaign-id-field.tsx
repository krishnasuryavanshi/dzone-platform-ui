import { FC } from 'react';
import { Input, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface ICampaignIdFieldProps {
  value: string;
}

export const CampaignIdField: FC<ICampaignIdFieldProps> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <Flex
      vertical
      gap="0.5rem"
      style={{ width: '25%', paddingRight: '0.5rem' }}
    >
      <Text>{t('pages.lineItems.label.campaignId')}</Text>
      <Input value={value} disabled size="large" />
    </Flex>
  );
};
