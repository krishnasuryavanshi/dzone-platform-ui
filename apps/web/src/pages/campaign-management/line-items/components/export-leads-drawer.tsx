import { FC } from 'react';
import { Drawer, Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { DeliveryPanel } from './delivery-panel';

interface IExportLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lineItemId?: string;
  tenantCode?: string;
}

export const ExportLeadsDrawer: FC<IExportLeadsDrawerProps> = ({
  isOpen,
  onClose,
  lineItemId,
  tenantCode,
}) => {
  return (
    <Drawer
      title='Export Leads'
      onClose={onClose}
      open={isOpen}
      closable
      maskClosable={false}
      placement='right'
      closeIcon={<CloseOutlined />}
      destroyOnClose
      width='35rem'>
      <Flex>
        <DeliveryPanel
          show={true}
          lineItemId={lineItemId || ''}
          tenantCode={tenantCode}
        />
      </Flex>
    </Drawer>
  );
};
