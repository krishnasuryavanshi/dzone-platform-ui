import { SyntheticEvent } from 'react';
import { ConfirmationDescription } from './confirmation-description';
import { ConfirmationFooter } from './confirmation-footer';
import { ConfirmationHeader } from './confirmation-header';

interface IConfirmationModal {
  className: string;
  title?: string;
  description?: string;
  cancelLabel?: string;
  proceedLabel?: string;
  archiveLeads?: boolean;
  onProceed: (event: SyntheticEvent) => void;
  onCancel: (event: SyntheticEvent) => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<IConfirmationModal> = ({
  className,
  title,
  description,
  cancelLabel,
  proceedLabel,
  archiveLeads,
  onProceed,
  onCancel,
  isLoading,
}) => {
  return (
    <div className={className}>
      <ConfirmationHeader title={title} archiveLeads={archiveLeads} />
      <ConfirmationDescription description={description} />
      <ConfirmationFooter
        onCancel={onCancel}
        onProceed={onProceed}
        cancelLabel={cancelLabel}
        proceedLabel={proceedLabel}
        isLoading={isLoading}
      />
    </div>
  );
};
