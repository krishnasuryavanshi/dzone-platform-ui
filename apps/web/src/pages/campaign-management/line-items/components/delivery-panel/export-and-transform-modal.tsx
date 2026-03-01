import { Flex, Space, Typography } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EXPORT_INFO_MESSAGE } from '../../lib/constants/delivery-message-constants';

const { Text } = Typography;

interface IExportAndTransformModalProps {
  filterLeadsCount: number;
}
export const ExportAndTransformModal: FC<IExportAndTransformModalProps> = ({
  filterLeadsCount,
}) => {
  const { t } = useTranslation();

  return (
    <Flex vertical style={{ marginLeft: '1.5rem', padding: '1rem' }}>
      <Space
        direction='vertical'
        style={{
          width: '100%',
          listStyleType: 'disc',
          paddingInlineStart: '2.5rem',
        }}>
        <Text style={{ display: 'list-item', marginBottom: '0' }}>
          <strong>{filterLeadsCount}</strong>{' '}
          {t('leads are being selected for transformation and export.')}
        </Text>
        <Text style={{ display: 'list-item' }}>
          {t(EXPORT_INFO_MESSAGE)}
        </Text>
      </Space>
    </Flex>
  );
};
