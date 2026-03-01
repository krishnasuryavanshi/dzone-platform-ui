import { Flex, Typography } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DZONE_CLR_BLACK } from '@dzone/shared-lib';

const { Title } = Typography;

interface IModalHeaderProps {
  title: string;
}

export const ModalHeader: FC<IModalHeaderProps> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <Flex gap='1.25rem' align='center'>
      <Flex
        style={{
          background: `${DZONE_CLR_BLACK}`,
          padding: '0.5rem 0.75rem',
          borderRadius: '50%',
        }}
      />
      <Title level={4} style={{ margin: 0 }}>
        {t(title)}
      </Title>
    </Flex>
  );
};
