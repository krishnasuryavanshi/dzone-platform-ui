import { Button, Flex, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { ConfirmationModal } from '../../../components/show-page';
import { leadsStatusUpdate } from '../../services';
import { useLeadsStore } from '../../stores';

interface IArchiveLeadsProps {
  leadIds: number[];
  tenantCode?: string;
  lineItemId?: string;
  filteredInfo?: Record<string, any>;
}

export const ArchiveLeads: FC<IArchiveLeadsProps> = ({
  leadIds,
  tenantCode,
  lineItemId,
  filteredInfo,
}) => {
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const setSelectedIds = useLeadsStore((state) => state.setSelectedIds);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const archiveLeads = async () => {
    if (!tenantCode || !leadIds.length || !lineItemId) return;
    setIsLoading(true);
    const leadUpdates = leadIds.map((id) => ({
      id,
      leadStatus: 'Archived',
    }));
    try {
      await leadsStatusUpdate(leadUpdates, tenantCode);
      // Refresh the leads list after archiving
      await fetchLeads(tenantCode, lineItemId, filteredInfo);
      setSelectedIds([]);
      setShowModal(false);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveClick = () => {
    setShowModal(true);
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <Flex>
      <Button
        style={{
          height: '2rem',
        }}
        className='dz-btn-action-1'
        disabled={leadIds.length === 0}
        onClick={handleArchiveClick}>
        {'Archive'}
      </Button>
      {showModal && (
        <Modal
          open={showModal}
          onCancel={handleCancel}
          footer={null}
          closable={false}
          className='confirm-cancel-modal'>
          <ConfirmationModal
            className='confirmation-modal'
            title='Are you sure you want to archive this lead?'
            description='This action is irreversible. All data associated with this lead will be permanently removed from the platform.'
            cancelLabel='Go back'
            proceedLabel='Yes, Archive'
            onProceed={archiveLeads}
            onCancel={handleCancel}
            archiveLeads={true}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </Flex>
  );
};
