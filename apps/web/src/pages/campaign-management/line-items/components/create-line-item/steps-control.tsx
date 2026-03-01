import { FC } from 'react';
import { CreateSteps } from '../../../components/create-steps';
import { steps } from '../../lib/constants';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';

interface IStepsProps {
  currentStep: number;
  handleStepperChange: (key: number) => void;
  savedSteps: { step: number; status: 'processed' }[];
}

export const StepsControl: FC<IStepsProps> = ({
  currentStep,
  handleStepperChange,
  savedSteps,
}) => {
  const hasEditCustomFieldsPermission = usePermissionCheck(
    LineItemActionsEnum.EditCustomFields,
  );

  const displaySteps = hasEditCustomFieldsPermission
    ? steps
    : {
        0: steps[0],
        1: steps[1],
      };

  return (
    <CreateSteps
      className='create-line-item-form'
      currentStep={currentStep}
      onHandleChange={handleStepperChange}
      stepKeys={displaySteps}
      steps={displaySteps}
      savedSteps={savedSteps}
    />
  );
};
