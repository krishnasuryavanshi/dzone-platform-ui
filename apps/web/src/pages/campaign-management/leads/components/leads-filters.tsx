import { useTranslation } from 'react-i18next';
import { Button, Flex } from 'antd';
import { DownOutlined } from '@ant-design/icons';
export const LeadsFilters = () => {
  const { t } = useTranslation();

  return (
    <Flex>
      <Button type='default' className='dz-btn-action-1'>
        {t('pages.leads.allLeads')}
        <DownOutlined style={{ marginLeft: '0.5rem' }} />
      </Button>
    </Flex>
  );
};
