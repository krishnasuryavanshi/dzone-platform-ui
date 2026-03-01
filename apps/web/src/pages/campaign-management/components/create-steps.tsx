// TODO: Migrate CreateSteps component from dzone-ui
import { FC } from 'react';
import { Steps } from 'antd';

interface CreateStepsProps {
  className?: string;
  currentStep: number;
  onHandleChange: (key: number) => void;
  stepKeys?: Record<string | number, any>;
  steps?: Record<string | number, any>;
  savedSteps?: { step: number; status: string }[];
  translation?: string;
  isDzoneUser?: boolean;
}

export const CreateSteps: FC<CreateStepsProps> = ({
  currentStep,
  onHandleChange,
  steps,
}) => {
  const stepItems = steps
    ? Object.entries(steps).map(([key, value]) => ({
        key,
        title: typeof value === 'string' ? value : (value as any)?.title || `Step ${key}`,
      }))
    : [];

  return (
    <Steps
      current={currentStep}
      onChange={onHandleChange}
      items={stepItems}
      size='small'
    />
  );
};
