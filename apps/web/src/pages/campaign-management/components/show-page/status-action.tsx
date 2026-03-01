import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Select, Spin, Modal, Flex, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { IStatus } from '../../lib/types';
import { combinedStatusOptions } from '../../lib/utils';
import { CampaignStatus } from '../campaign-status';
import { ConfirmationModal } from './confirmation-modal';
import styles from './status-action.module.css';

interface IStatusActionProps {
  record: Record<string, any>;
}

export const StatusAction: FC<IStatusActionProps> = ({ record }) => {
  // TODO: Replace with Zustand store when available in 5C
  const statusList: any[] = [];
  const setUpdateList = (_data: any) => {};

  // TODO: Import usePermissionCheck from @dzone/shared-auth
  const isUpdateStatusAllowed = true;

  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>();
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);

  const handleChange = (value: string) => {
    const status = combinedOptions.find((s: any) => s?.value === value);
    setSelectedStatus({
      ...status,
      name: status?.value,
      value: status?.label,
      type: status?.type,
      title: status?.title,
      description: status?.description,
      positiveMessage: status?.positiveMessage,
      negativeMessage: status?.negativeMessage,
    });
    if (status?.value === 'CANCELLED') {
      setOpenCancelModal(true);
    }
  };

  const fetchUpdatedData = async (statusData: IStatus, id: string) => {
    try {
      setIsLoading(true);
      const { updateLineItemStatus } = await import('../../line-items/services');
      const updatedList = await updateLineItemStatus(id, {
        type: statusData.type,
        status: statusData.name,
      });
      if (updatedList?.data) {
        setUpdateList(updatedList.data);
        notification.success({ message: updatedList.message });
      }
    } catch {
      setSelectedStatus(null);
    } finally {
      setIsLoading(false);
      setUpdateStatus(false);
    }
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    setOpenCancelModal(false);
    setUpdateStatus(false);
  };

  const confirmCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    if (selectedStatus) {
      fetchUpdatedData(selectedStatus, record.id);
      setOpenCancelModal(false);
    }
  };

  useEffect(() => {
    if (!selectedStatus) return;
    const isDifferentStatus = selectedStatus.value !== record.status?.value;
    const isStatusCancel = selectedStatus.value !== 'CANCELLED';
    if (isDifferentStatus && isStatusCancel && !openCancelModal) {
      fetchUpdatedData(selectedStatus, record.id);
    }
  }, [selectedStatus]);

  const combinedOptions = combinedStatusOptions(statusList, record);

  if (isLoading) {
    return (
      <Spin
        style={{ marginLeft: '30%' }}
        indicator={<LoadingOutlined style={{ fontSize: 24, color: '#235aed' }} spin />}
      />
    );
  }

  return (
    <>
      {openCancelModal && (
        <Modal open={openCancelModal} onCancel={handleCancel} footer={null} closable={false}>
          <ConfirmationModal
            className="confirmation-modal"
            title={selectedStatus?.title}
            description={selectedStatus?.description}
            cancelLabel={selectedStatus?.negativeMessage}
            proceedLabel={selectedStatus?.positiveMessage}
            onProceed={confirmCancel}
            onCancel={handleCancel}
          />
        </Modal>
      )}
      {updateStatus ? (
        <Select
          className={styles.customStatusSelect}
          open={updateStatus}
          size="large"
          value={selectedStatus?.value}
          placeholder={record.status?.value}
          onClick={(e) => e.stopPropagation()}
          onDropdownVisibleChange={(visible) => {
            if (!visible) setUpdateStatus(false);
          }}
          onChange={handleChange}
        >
          {combinedOptions.map((status: any) => (
            <Select.Option key={status?.value} value={status?.value}>
              <Flex justify="space-between">
                <span style={{ marginLeft: '8px' }}>{status?.label}</span>
              </Flex>
            </Select.Option>
          ))}
        </Select>
      ) : (
        <Flex
          onClick={(e) => {
            e.stopPropagation();
            if (record.status?.value !== 'CANCELLED' && isUpdateStatusAllowed) {
              setUpdateStatus(true);
            }
          }}
        >
          <CampaignStatus status={record.status} />
        </Flex>
      )}
    </>
  );
};
