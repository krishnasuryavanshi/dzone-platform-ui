import { CLR_BLUE_LIGHT, CampaignActionsEnum } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { Select, Flex, Modal, Spin, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ICampaign } from '../lib/types';
import { fetchCampaignStatuses, putCreateCampaign } from '../services';
import { CampaignStatus } from '../../components/campaign-status';
import { ALLOWED_STATUS } from '../lib/constants';
import { ConfirmationModal } from './status-confirmation-modal';
import styles from './campaign-status-action.module.css';

// Simple module-level cache to prevent multiple API calls
let statusesCache: IStatus[] | null = null;
let fetchPromise: Promise<IStatus[]> | null = null;

interface IStatusActionProps {
  record: ICampaign;
}

interface IStatus {
  name: string;
  value: string;
}

export const CampaignStatusAction: FC<IStatusActionProps> = ({ record }) => {
  const navigate = useNavigate();
  const isUpdateStatusAllowed = usePermissionCheck(CampaignActionsEnum.Edit);

  const [statusList, setStatusList] = useState<IStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>();
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleChange = (value: string) => {
    const status = statusList.find((status: any) => status?.value === value);
    setSelectedStatus(status);
    if (status?.value === 'ARCHIVED') {
      setOpenModal(true);
    }
  };

  const fetchUpdatedData = async (statusData: IStatus, id: string) => {
    try {
      setIsLoading(true);
      const params = {
        status: statusData.value,
      };
      const data = await putCreateCampaign(params, id);
      if (data?.data) {
        notification.success({
          message:
            statusData.value === 'BOOKED'
              ? 'Campaign status updated successfully'
              : 'Campaign is archived successfully',
        });
        navigate('/campaign-management/campaigns');
      }
    } catch (error) {
      setSelectedStatus(null);
    } finally {
      setIsLoading(false);
      setUpdateStatus(false);
    }
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    setOpenModal(false);
    setUpdateStatus(false);
  };

  const confirmCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    if (selectedStatus) {
      fetchUpdatedData(selectedStatus, record.id);
      setOpenModal(false);
    }
  };

  const fetchStatusData = async () => {
    // Return cached data if available
    if (statusesCache) {
      setStatusList(statusesCache);
      return;
    }

    // If already fetching, wait for the existing promise
    if (fetchPromise) {
      const result = await fetchPromise;
      setStatusList(result);
      return;
    }

    // Start new fetch
    fetchPromise = fetchCampaignStatuses()
      .then((data) => {
        const filteredStatuses = data
          .filter((status: { value: string }) =>
            ALLOWED_STATUS.includes(status.value),
          )
          .map((status: { text: string; value: string }) => ({
            name: status.text,
            value: status.value,
          }));

        statusesCache = filteredStatuses;
        fetchPromise = null;
        return filteredStatuses;
      })
      .catch(() => {
        fetchPromise = null;
        return [];
      });

    const result = await fetchPromise;
    setStatusList(result);
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  useEffect(() => {
    if (!selectedStatus) return;

    const currentStatusValue = typeof record.status === 'string' ? record.status : record.status?.value;
    const isDifferentStatus = selectedStatus.value !== currentStatusValue;

    if (isDifferentStatus && !openModal) {
      fetchUpdatedData(selectedStatus, record.id);
    }
  }, [selectedStatus]);

  if (isLoading) {
    return (
      <Spin
        style={{ marginLeft: '30%' }}
        indicator={
          <LoadingOutlined
            style={{ fontSize: 24, color: CLR_BLUE_LIGHT }}
            spin
          />
        }
      />
    );
  }

  return (
    <>
      {openModal ? (
        <Modal
          open={openModal}
          onCancel={handleCancel}
          footer={null}
          closable={false}
          className='confirm-cancel-modal'>
          <ConfirmationModal
            className='confirmation-modal'
            onProceed={confirmCancel}
            onCancel={handleCancel}
          />
        </Modal>
      ) : null}
      {updateStatus ? (
        <Select
          className={styles.customStatusSelect}
          open={updateStatus}
          size='large'
          value={selectedStatus?.value || (typeof record.status === 'string' ? record.status : record.status?.value)}
          placeholder={typeof record.status === 'string' ? record.status : record.status?.value}
          onClick={(e) => e.stopPropagation()}
          onDropdownVisibleChange={(visible) => {
            if (!visible) {
              setUpdateStatus(false);
            }
          }}
          onChange={handleChange}>
          {statusList.map((status: any) => {
            return (
              <Select.Option key={status?.value} value={status?.value}>
                <Flex justify='space-between'>
                  <span style={{ marginLeft: '8px' }}>{status?.name}</span>
                </Flex>
              </Select.Option>
            );
          })}
        </Select>
      ) : (
        <Flex
          onClick={(e) => {
            e.stopPropagation();
            if (isUpdateStatusAllowed) {
              setUpdateStatus(true);
            }
          }}
          style={{ cursor: isUpdateStatusAllowed ? 'pointer' : 'default' }}>
          <CampaignStatus status={record.status} />
        </Flex>
      )}
    </>
  );
};
