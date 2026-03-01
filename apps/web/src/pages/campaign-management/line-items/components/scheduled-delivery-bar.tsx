import { FC, useState, useEffect, useCallback } from 'react';
import { Button, Flex, Space, Typography } from 'antd';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LeadActionsEnum } from '@dzone/shared-lib';
import { ExportLeadsDrawer } from './export-leads-drawer';
import { ScheduleDeliveryDrawer } from './schedule-delivery-drawer';
import { DeliverySchedule } from '../services';
import { useLeadsCountStore } from '../../leads/stores';

const { Text } = Typography;

interface IScheduledDeliveryBarProps {
  show: boolean;
  scheduledCount?: number;
  lineItemId?: string;
  tenantCode?: string;
  onScheduleDelivery?: () => void;
  onScheduleCreated?: () => void;
  onRegisterEditHandler?: (
    handler: (schedule: DeliverySchedule) => void,
  ) => void;
}

export const ScheduledDeliveryBar: FC<IScheduledDeliveryBarProps> = ({
  show,
  scheduledCount = 1,
  lineItemId,
  tenantCode,
  onScheduleDelivery,
  onScheduleCreated,
  onRegisterEditHandler,
}) => {
  const totalLeads = useLeadsCountStore((state) => state.totalLeads);
  const isDisabled = totalLeads === 0;

  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<DeliverySchedule | null>(
    null,
  );

  const canScheduleDelivery = usePermissionCheck(
    LeadActionsEnum.ScheduleDelivery,
  );

  const handleExportClick = () => {
    setIsExportDrawerOpen(true);
  };

  const handleExportDrawerClose = () => {
    setIsExportDrawerOpen(false);
  };

  const handleScheduleClick = () => {
    setEditSchedule(null); // Clear any edit schedule
    setIsScheduleDrawerOpen(true);
    onScheduleDelivery?.();
  };

  const handleEditSchedule = useCallback((schedule: DeliverySchedule) => {
    setEditSchedule(schedule);
    setIsScheduleDrawerOpen(true);
  }, []);

  useEffect(() => {
    if (onRegisterEditHandler) {
      onRegisterEditHandler(handleEditSchedule);
    }
  }, [onRegisterEditHandler, handleEditSchedule]);

  if (!show) {
    return null;
  }

  const handleScheduleDrawerClose = () => {
    setIsScheduleDrawerOpen(false);
    setEditSchedule(null);
  };

  const handleScheduleCreated = () => {
    onScheduleCreated?.();
  };

  return (
    <>
      <Flex
        style={{ padding: '0.75rem 1rem' }}
        justify='space-between'
        align='center'>
        {canScheduleDelivery ? (
          <Text strong>Scheduled delivery ({scheduledCount})</Text>
        ) : (
          <div />
        )}
        <Space>
          <Button
            onClick={handleExportClick}
            disabled={isDisabled}
            className='dz-btn-action-1'>
            Export
          </Button>
          {canScheduleDelivery && (
            <Button className='dz-btn-action-1' onClick={handleScheduleClick}>
              Schedule Delivery
            </Button>
          )}
        </Space>
      </Flex>
      <ExportLeadsDrawer
        isOpen={isExportDrawerOpen}
        onClose={handleExportDrawerClose}
        lineItemId={lineItemId}
        tenantCode={tenantCode}
      />
      {canScheduleDelivery && (
        <ScheduleDeliveryDrawer
          isOpen={isScheduleDrawerOpen}
          onClose={handleScheduleDrawerClose}
          lineItemId={lineItemId || ''}
          onScheduleCreated={handleScheduleCreated}
          editSchedule={editSchedule}
        />
      )}
    </>
  );
};
