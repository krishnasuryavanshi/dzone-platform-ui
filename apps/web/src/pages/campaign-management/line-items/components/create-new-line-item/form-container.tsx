import { ScreenLoader } from '@dzone/shared-ui';
import { LineItemActionsEnum } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { Flex } from 'antd';
import { FC, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { StepsControl } from '../create-line-item/steps-control';
import { BasicDetails } from './basic-details';
import { CustomFieldsWrapper } from './custom-fields';
import { ValidationSettingsContainer } from './validation-settings-container';

interface IFormContainerProps {
  campaignUuid?: string;
  campaignData?: any;
  tenantCode?: string | string[];
  lineItemId?: string;
  lineItemDetails?: any;
  userId?: string;
  isDzoneUser?: boolean;
  isEditing?: boolean;
  onCreateSuccess?: (lineItemId: string) => void;
  loading: boolean;
}

export const FormContainer: FC<IFormContainerProps> = ({
  campaignUuid,
  campaignData,
  tenantCode,
  lineItemId,
  lineItemDetails,
  userId,
  isDzoneUser,
  onCreateSuccess,
  loading,
}) => {
  const { updateQueryParams } = useUpdateQueryState();
  const [currentStep, setCurrentStep] = useState(0);
  const hasEditCustomFieldsPermission = usePermissionCheck(
    LineItemActionsEnum.EditCustomFields,
  );

  const handleRedirectAfterCreate = (newLineItemId: string) => {
    onCreateSuccess?.(newLineItemId);
    setCurrentStep(1);
    updateQueryParams(1);
  };

  const savedSteps: { step: number; status: 'processed' }[] = [
    { step: 0, status: 'processed' },
    ...(lineItemId
      ? [
          { step: 1, status: 'processed' as const },
          ...(hasEditCustomFieldsPermission
            ? [{ step: 2, status: 'processed' as const }]
            : []),
        ]
      : []),
  ];

  const handleStepperChange = async (key: number) => {
    if (key >= savedSteps.length) {
      return;
    }
    setCurrentStep(key);
    updateQueryParams(key);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetails
            campaignUuid={campaignUuid}
            campaignData={campaignData}
            tenantCode={tenantCode}
            lineItemId={lineItemId}
            lineItemDetails={lineItemDetails}
            userId={userId}
            isDzoneUser={isDzoneUser}
            onCreateSuccess={handleRedirectAfterCreate}
            nextStep={1}
            handleStepperChange={handleStepperChange}
          />
        );
      case 1:
        return (
          <ValidationSettingsContainer
            lineItemId={lineItemId}
            leadValidationSettingId={lineItemDetails?.validationSettingsId}
            nextStep={hasEditCustomFieldsPermission ? 2 : undefined}
            handleStepperChange={handleStepperChange}
          />
        );
      case 2:
        return <CustomFieldsWrapper lineItemDetails={lineItemDetails} />;
      default:
        return null;
    }
  };
  if (loading && lineItemId) {
    return <ScreenLoader />;
  }
  return (
    <Flex vertical gap='0.75rem' style={{ width: '100%' }}>
      <StepsControl
        currentStep={currentStep}
        handleStepperChange={handleStepperChange}
        savedSteps={savedSteps}
      />
      {renderStepComponent()}
    </Flex>
  );
};
