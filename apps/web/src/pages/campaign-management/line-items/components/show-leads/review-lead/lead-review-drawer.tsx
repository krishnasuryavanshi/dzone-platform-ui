import { Drawer, Flex, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import { FC } from 'react';
import { LeadReviewContainer } from './lead-review-container';

import './lead-review-drawer.css';

const { Text } = Typography;

const DrawerCloseButton = () => (
  <Flex
    align='center'
    justify='center'
    style={{
      cursor: 'pointer',
      borderRadius: '50%',
      backgroundColor: DZONE_CLR_BLACK,
      padding: '0.5rem',
    }}>
    <LeftOutlined
      style={{
        fontSize: '0.75rem',
        cursor: 'pointer',
        stroke: '#fff',
        strokeWidth: '50',
      }}
    />
  </Flex>
);

interface ILeadReviewDrawerProps {
  isOpen: boolean;
  currentLeadTrackingId: string;
  currentLeadId: number;
  lineItemId: string;
  leadStatuses: string[];
  validationStatuses: string[];
  handleClose: () => void;
  tenantCode?: string;
}

export const LeadReviewDrawer: FC<ILeadReviewDrawerProps> = ({
  isOpen,
  currentLeadTrackingId,
  currentLeadId,
  lineItemId,
  leadStatuses,
  validationStatuses,
  handleClose,
  tenantCode,
}) => {
  return (
    <Drawer
      className='dz-drawer dz-lead-review-drawer'
      closable
      destroyOnClose
      maskClosable={false}
      size='large'
      placement='right'
      closeIcon={<DrawerCloseButton />}
      title={<Text strong>Lead Review</Text>}
      open={isOpen}
      onClose={handleClose}>
      <LeadReviewContainer
        show={isOpen}
        selectedLeadTrackingId={currentLeadTrackingId}
        selectedCurrentLeadId={currentLeadId}
        lineItemId={lineItemId}
        leadStatuses={leadStatuses}
        validationStatuses={validationStatuses}
        tenantCode={tenantCode}
      />
    </Drawer>
  );
};
