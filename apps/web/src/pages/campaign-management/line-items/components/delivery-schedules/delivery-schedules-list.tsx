import { BasicTable } from '@dzone/shared-ui';
import { Button, Dropdown, Tag, Spin, Typography, Modal, Flex, notification } from 'antd';
import type { TableProps } from 'antd';
import { MoreOutlined, WarningOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createColumn } from '../../lib/utils/create-columns';
import {
  fetchDeliverySchedules,
  updateDeliveryScheduleStatus,
  DeliverySchedule,
} from '../../services';
import { DeliveryType } from '../../lib/enums/delivery-types';
import styles from './delivery-schedules-list.module.css';

const { Text } = Typography;

interface DeliverySchedulesListProps {
  lineItemId: string;
  onSchedulesLoaded?: (count: number) => void;
  refreshTrigger?: number;
  onEditSchedule?: (schedule: DeliverySchedule) => void;
}

export const DeliverySchedulesList: React.FC<DeliverySchedulesListProps> = ({
  lineItemId,
  onSchedulesLoaded,
  refreshTrigger,
  onEditSchedule,
}) => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<DeliverySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (lineItemId) {
      loadSchedules();
    }
  }, [lineItemId, refreshTrigger]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetchDeliverySchedules(lineItemId);
      if (response) {
        const { data, total } = response;
        setSchedules(data || []);
        // Notify parent component of the count
        if (onSchedulesLoaded) {
          onSchedulesLoaded(total || data?.length || 0);
        }
      }
    } catch (err) {
      // Error is handled by service
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    scheduleId: string,
    newStatus: 'Active' | 'Paused' | 'Cancelled',
  ) => {
    try {
      setUpdating(scheduleId);
      const result = await updateDeliveryScheduleStatus(scheduleId, newStatus);
      if (result) {
        notification.success({
          message: `Schedule ${newStatus.toLowerCase()} successfully`,
        });
        await loadSchedules();
      } else {
        notification.error({
          message: 'Failed to update schedule status',
        });
      }
    } catch (err) {
      notification.error({
        message: 'Failed to update schedule status',
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleEditSchedule = (record: DeliverySchedule) => {
    if (onEditSchedule) {
      onEditSchedule(record);
    }
  };

  const handleViewLogs = (record: DeliverySchedule) => {
    navigate(
      `/campaign-management/line-items/${lineItemId}/delivery-logs?scheduleId=${record.id}`,
    );
  };

  const [modal, contextHolder] = Modal.useModal();

  const confirm = (scheduleId: string, deliveryType: string) => {
    modal.confirm({
      title: 'Are you sure you want to cancel this schedule?',
      icon: <WarningOutlined style={{ color: '#E04149' }} />,
      content: `Leads will no longer be sent to ${deliveryType} automatically. You'll need to set up a new schedule to resume delivery.`,
      okButtonProps: { danger: true },
      onOk: () => handleStatusChange(scheduleId, 'Cancelled'),
      okText: 'Yes, Cancel Schedule',
      cancelText: 'Nope, Keep It',
      closable: true,
    });
  };

  const getActionItems = (record: DeliverySchedule) => {
    const items = [];

    if (record.status === 'Active') {
      items.push({
        key: 'pause',
        label: 'Pause Schedule',
        onClick: () => handleStatusChange(record.id, 'Paused'),
      });
    } else if (record.status === 'Paused') {
      items.push({
        key: 'resume',
        label: 'Resume Schedule',
        onClick: () => handleStatusChange(record.id, 'Active'),
      });
    }

    if (record.status !== 'Cancelled') {
      items.push({
        key: 'edit',
        label: 'Edit Schedule',
        onClick: () => handleEditSchedule(record),
      });
    }

    if (record.status !== 'Cancelled') {
      items.push({
        key: 'cancel',
        label: 'Cancel Schedule',
        onClick: () => confirm(record.id, record.deliveryType),
      });
    }

    items.push({
      key: 'logs',
      label: 'View Logs',
      onClick: () => handleViewLogs(record),
    });

    return items;
  };

  const typeRenderer = (_: unknown, record: unknown) => {
    const deliverySchedule = record as DeliverySchedule;
    return (
      <Flex vertical>
        <Text className={styles.primaryText}>
          {deliverySchedule.deliveryType === DeliveryType.FLAT_FILE
            ? 'Flat File'
            : deliverySchedule.deliveryType}
        </Text>
        {deliverySchedule.deliveryTemplate && (
          <Text className={styles.secondaryText}>
            {deliverySchedule.deliveryTemplate}
          </Text>
        )}
      </Flex>
    );
  };

  const frequencyRenderer = (_: unknown, record: unknown) => {
    const deliverySchedule = record as DeliverySchedule;
    let frequencyText = deliverySchedule.frequency;
    if (deliverySchedule.frequency === 'RealTime') {
      return <Text className={styles.primaryText}>Real Time</Text>;
    }

    let scheduleDetail = '';
    if (
      deliverySchedule.frequency === 'Weekly' &&
      deliverySchedule.deliveryDay
    ) {
      const dayNames = [
        '',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      scheduleDetail = dayNames[deliverySchedule.deliveryDay] || '';
    } else if (
      deliverySchedule.frequency === 'Monthly' &&
      deliverySchedule.deliveryDate
    ) {
      scheduleDetail = `${deliverySchedule.deliveryDate}`;
    }

    const timeText = deliverySchedule.deliveryTime
      ? `${scheduleDetail ? scheduleDetail + ' at ' : ''}${deliverySchedule.deliveryTime}`
      : scheduleDetail;

    return (
      <Flex vertical>
        <Text className={styles.primaryText}>{frequencyText}</Text>
        {timeText && <Text className={styles.secondaryText}>{timeText}</Text>}
      </Flex>
    );
  };

  const statusRenderer = (status: DeliverySchedule['status']) => {
    const color =
      status === 'Active'
        ? 'success'
        : status === 'Paused'
          ? 'warning'
          : status === 'Cancelled'
            ? 'error'
            : 'default';
    return <Tag color={color}>{status}</Tag>;
  };

  const nextDeliveryRenderer = (_: unknown, record: unknown) => {
    const deliverySchedule = record as DeliverySchedule;
    return (
      <Text className={styles.primaryText}>
        {deliverySchedule.nextDelivery || '-'}
      </Text>
    );
  };

  const actionsRenderer = (_: unknown, record: unknown) => {
    const deliverySchedule = record as DeliverySchedule;
    const items = getActionItems(deliverySchedule);

    return (
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement='bottomRight'
        disabled={updating === deliverySchedule.id}>
        <Button
          type='text'
          icon={<MoreOutlined />}
          loading={updating === deliverySchedule.id}
          className={styles.actionButton}
        />
      </Dropdown>
    );
  };

  const column = createColumn(false);
  const columns: TableProps<DeliverySchedule>['columns'] = [
    column('Type & Template', 'deliveryType', { width: 200 }, typeRenderer),
    column('Frequency', 'frequency', { width: 200 }, frequencyRenderer),
    column(
      'Next Delivery',
      'nextDelivery',
      { width: 150 },
      nextDeliveryRenderer,
    ),
    column('Status', 'status', { width: 120 }, statusRenderer),
    // Temporarily removed lead count column
    // column('Performance', 'leadCount', { width: 180 }, performanceRenderer),
    column(
      'Actions',
      'actions',
      { width: 80, align: 'center' },
      actionsRenderer,
    ),
  ];

  if (loading) {
    return (
      <Flex justify='center' align='center' className={styles.loadingContainer}>
        <Spin size='large' />
      </Flex>
    );
  }

  return (
    <Flex vertical className={styles.deliverySchedulesContainer}>
      {contextHolder}
      <BasicTable
        className='row-hover-highlight'
        columns={columns}
        data={schedules}
        hasPagination={false}
      />
    </Flex>
  );
};
