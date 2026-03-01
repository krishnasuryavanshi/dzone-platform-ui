import { Flex, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { DZONE_CLR_BLACK, CLR_WHITE } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

const { Title } = Typography;

interface IModalHeaderProps {}

export const ModalHeader: FC<IModalHeaderProps> = ({}) => {
  const { t } = useTranslation();

  return (
    <Flex gap='0.5rem'>
      <CopyOutlined
        style={{
          background: `${DZONE_CLR_BLACK}`,
          borderRadius: '50%',
          color: `${CLR_WHITE}`,
          padding: '8px',
        }}
      />
      <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
        {t('pages.lineItems.label.cloneLineItem')}
      </Title>
    </Flex>
  );
};
