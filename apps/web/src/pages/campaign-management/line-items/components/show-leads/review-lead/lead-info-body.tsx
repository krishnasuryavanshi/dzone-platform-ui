import { LoadingOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { LeadValidationForm } from './lead-validation-form';
import { pick } from 'lodash-es';
import { LeadError } from './lead-review-container';

// TODO: Import ILead from leads module once migrated
// import { ILead } from '../../../../leads/lib/types';
type ILead = Record<string, any>;

interface ILeadInfoBodyProps {
  leadDetails: ILead | null;
  updateInitialFormValue: (formValue: Record<string, any>) => void;
  handleFormValueChange: (formValue: Record<string, any>) => void;
  leadErrorMessages: LeadError[];
  leadValidationStatus: string;
  handleRevalidateDisability: (status: boolean) => void;
  leadReviewFormConfig: Record<string, any>[];
}

export const LeadInfoBody: FC<ILeadInfoBodyProps> = ({
  leadDetails,
  updateInitialFormValue,
  handleFormValueChange,
  leadErrorMessages,
  leadValidationStatus,
  handleRevalidateDisability,
  leadReviewFormConfig,
}) => {
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (leadDetails && leadReviewFormConfig.length > 0) {
      const fieldList = leadReviewFormConfig.map((field) => field.name);
      const mergedLeadDetails = {
        ...leadDetails,
        ...(leadDetails || {}), // Merge properties from nested lead object if it exists
      };
      const formValue = pick(mergedLeadDetails, fieldList);
      setInitialValues(formValue);
      updateInitialFormValue(formValue);
    }
  }, [leadDetails, leadReviewFormConfig]);

  if (!leadDetails || !leadReviewFormConfig?.length) {
    return <LoadingOutlined />;
  }

  return (
    <LeadValidationForm
      initialValues={initialValues}
      handleFormValueChange={handleFormValueChange}
      leadErrorMessages={leadErrorMessages}
      leadValidationStatus={leadValidationStatus}
      handleRevalidateDisability={handleRevalidateDisability}
      leadReviewFormConfig={leadReviewFormConfig}
    />
  );
};
