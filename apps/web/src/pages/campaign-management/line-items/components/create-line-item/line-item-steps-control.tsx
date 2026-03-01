import { FC } from 'react';
import { LineItemFormConfig } from '../../config/forms';
import { CreateSteps } from '../../../components/create-steps';
import { StepKeysList } from '../../lib/constants';
import { cloneDeep } from 'lodash-es';

interface IStepsProps {
  currentStep: number;
  handleStepperChange: (key: number) => void;
  savedSteps: { step: number; status: 'processed' }[];
}

export const LineItemStepsControl: FC<IStepsProps> = ({
  currentStep,
  handleStepperChange,
  savedSteps,
}) => {
  const { steps, translation } = cloneDeep(LineItemFormConfig);

  return (
    <CreateSteps
      className="create-line-item-form"
      currentStep={currentStep}
      onHandleChange={handleStepperChange}
      stepKeys={StepKeysList}
      steps={steps}
      savedSteps={savedSteps}
      translation={translation}
    />
  );
};
