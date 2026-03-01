import { type FC } from 'react';
import { Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface ChartsAdditionalProps {
  label: string;
}

export const ChartsAdditional: FC<ChartsAdditionalProps> = ({ label }) => {
  const { t } = useTranslation();
  return (
    <Flex gap="0.5rem" align="center">
      <span
        style={{
          height: '0.5rem',
          width: '0.375rem',
          borderRadius: '1px',
          backgroundColor: '#3D71FB',
          display: 'inline-block',
        }}
      />
      <Text style={{ fontSize: '0.75rem', fontWeight: 400 }}>{t(label)}</Text>
    </Flex>
  );
};
