import { useTranslation } from 'react-i18next';
import { Button, Flex } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export const LineItemsFilters = () => {
  const { t } = useTranslation();

  return (
    <Flex>
      <Button type='default' className='dz-btn-action-1'>
        {t('pages.lineItems.label.allLineItems')}
        <DownOutlined style={{ marginLeft: '0.5rem' }} />
      </Button>
    </Flex>
  );
};
