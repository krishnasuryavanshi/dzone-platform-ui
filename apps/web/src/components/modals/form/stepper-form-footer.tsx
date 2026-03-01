// TODO: Migrate StepperFormFooter from dzone-ui
import React, { FC } from 'react';
import { Button, Flex } from 'antd';

interface StepperFormFooterProps {
  title?: string;
  onCancel?: () => void;
  onSaveAndClose?: () => void;
  onSubmit?: () => void;
  onNext?: () => void;
  step?: number;
  showSaveAndClose?: boolean;
  style?: React.CSSProperties;
}

export const StepperFormFooter: FC<StepperFormFooterProps> = ({
  onCancel,
  onSaveAndClose,
  onNext,
  showSaveAndClose = true,
  style,
}) => (
  <Flex justify='end' gap='0.5rem' style={style}>
    <Button onClick={onCancel}>Cancel</Button>
    {showSaveAndClose && (
      <Button onClick={onSaveAndClose}>Save & Close</Button>
    )}
    <Button type='primary' onClick={onNext}>
      Next
    </Button>
  </Flex>
);
