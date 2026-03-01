import { Modal } from 'antd';
import { FC } from 'react';
import { ReturnReasonsModalHeader } from './return-reason-modal-header';
import { ReturnReasonsModalBody } from './return-reason-modal-body';

interface IReturnReasonsModalProps {
  isModalOpen: boolean;
  selectedReasons: string[];
  handleReturnLeads: () => void;
  reasons: { name: string; value: string }[];
  leadIds: number[];
  onCancel: () => void;
  isLoading: boolean;
  handleSelectReason: (reasons: string[]) => void;
}

export const ReturnReasonsModal: FC<IReturnReasonsModalProps> = ({
  isModalOpen,
  selectedReasons,
  handleReturnLeads,
  reasons,
  leadIds,
  onCancel,
  isLoading,
  handleSelectReason,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      closable={false}
      className='confirm-cancel-modal'>
      {/* Header */}
      <ReturnReasonsModalHeader onCancel={onCancel} />
      {/* Body */}
      <ReturnReasonsModalBody
        reasons={reasons}
        leadIds={leadIds}
        selectedReasons={selectedReasons}
        handleSelectReason={handleSelectReason}
        handleReturnLeads={handleReturnLeads}
        isLoading={isLoading}
      />
    </Modal>
  );
};
