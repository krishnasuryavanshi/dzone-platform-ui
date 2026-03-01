import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import { Button, Flex, notification } from 'antd';
import { FC, useEffect, useState } from 'react';
import { returnLeads } from '../../services';
// TODO: Import from leads module once migrated
// import { fetchReturnReasonsList } from '../../../leads/services';
import { ReturnReasonsModal } from './return-reasons-Modal';

interface IReturnLeadsProps {
  lineItemId: string;
  leadIds: number[];
  onSuccess: () => void;
}

export const ReturnLeads: FC<IReturnLeadsProps> = ({
  lineItemId,
  leadIds,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reasons, _setReasons] = useState<{ name: string; value: string }[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const fetchReturnReasons = async () => {
    // TODO: Import from leads module once migrated
    // const data = await fetchReturnReasonsList();
    // setReasons(data?.data || []);
  };
  useEffect(() => {
    fetchReturnReasons();
  }, []);
  const openModal = async () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setSelectedReasons([]);
  };

  const handleSelectReason = (reasons: string[]) => {
    setSelectedReasons(reasons);
  };

  const handleReturnLeads = async () => {
    setIsLoading(true);
    try {
      const data = await returnLeads(lineItemId, leadIds, selectedReasons);
      if (data?.message) {
        notification.success({
          message: data.message,
        });
      }
      onSuccess();
      setIsModalOpen(false);
      setSelectedReasons([]);
    } catch (error) {
      // Already handled in the service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex>
      <Button
        style={{
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          border:
            leadIds.length === 0
              ? `1px solid #d4d4d4`
              : `1px solid ${DZONE_CLR_BLACK}`,
          minWidth: '7rem',
        }}
        disabled={leadIds.length === 0 || isLoading}
        loading={isLoading}
        onClick={openModal}>
        {!isLoading && 'Return Leads'}
      </Button>
      <ReturnReasonsModal
        isModalOpen={isModalOpen}
        selectedReasons={selectedReasons}
        handleReturnLeads={handleReturnLeads}
        reasons={reasons}
        leadIds={leadIds}
        onCancel={onCancel}
        isLoading={isLoading}
        handleSelectReason={handleSelectReason}
      />
    </Flex>
  );
};
