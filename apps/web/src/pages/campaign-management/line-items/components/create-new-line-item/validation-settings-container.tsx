import { Hideable } from '@dzone/shared-ui';
import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router';
import { LeadValidationSettingsContainer } from '../lead-validation-settings';

type ValidationSettingsContainerProps = {
  lineItemId?: string;
  leadValidationSettingId: string;
  nextStep?: number;
  handleStepperChange?: (key: number) => void;
};

export const ValidationSettingsContainer = ({
  lineItemId,
  leadValidationSettingId,
  nextStep,
  handleStepperChange,
}: ValidationSettingsContainerProps) => {
  const navigate = useNavigate();

  const handleNext = () => {
    handleStepperChange && nextStep && handleStepperChange(nextStep);
  };

  const handleCancel = () => {
    navigate(`/campaign-management/line-items`);
  };

  return (
    <Flex vertical gap={'1rem'}>
      <LeadValidationSettingsContainer
        isEditing={true}
        lineItemId={lineItemId}
        leadValidationSettingId={leadValidationSettingId}
      />
      <Hideable show={!!nextStep}>
        <Flex justify='end' gap={'0.5rem'}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='primary' onClick={handleNext}>
            Next
          </Button>
        </Flex>
      </Hideable>
      <Hideable show={!nextStep}>
        <Flex justify='end' gap={'0.5rem'}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='primary' onClick={handleCancel}>
            Done
          </Button>
        </Flex>
      </Hideable>
    </Flex>
  );
};
