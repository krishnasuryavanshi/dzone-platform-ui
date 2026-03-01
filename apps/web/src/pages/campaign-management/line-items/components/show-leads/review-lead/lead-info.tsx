import { Flex } from 'antd';
import { FC } from 'react';
import { LeadInfoBody } from './lead-info-body';
import { LeadError } from './lead-review-container';

// TODO: Import ILead from leads module once migrated
// import { ILead } from '../../../../leads/lib/types';
type ILead = Record<string, any>;

interface ILeadInfoProps {
  leadDetails: ILead | null;
  updateInitialFormValue: (formValue: Record<string, any>) => void;
  handleFormValueChange: (formValue: Record<string, any>) => void;
  leadErrorMessages: LeadError[];
  leadValidationStatus: string;
  handleRevalidateDisability: (status: boolean) => void;
  leadReviewFormConfig: Record<string, any>[];
}

export const LeadInfo: FC<ILeadInfoProps> = ({
  leadDetails,
  updateInitialFormValue,
  handleFormValueChange,
  leadErrorMessages,
  leadValidationStatus,
  handleRevalidateDisability,
  leadReviewFormConfig,
}) => {
  return (
    <Flex vertical gap={'0.5rem'} style={{ flex: 1, height: '100%', overflow: 'auto' }}>
      <LeadInfoBody
        leadDetails={leadDetails}
        updateInitialFormValue={updateInitialFormValue}
        handleFormValueChange={handleFormValueChange}
        leadErrorMessages={leadErrorMessages}
        leadValidationStatus={leadValidationStatus}
        handleRevalidateDisability={handleRevalidateDisability}
        leadReviewFormConfig={leadReviewFormConfig}
      />
    </Flex>
  );
};
