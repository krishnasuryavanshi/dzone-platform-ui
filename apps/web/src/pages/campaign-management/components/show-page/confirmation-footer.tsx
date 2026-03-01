import { Button, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SyntheticEvent } from 'react';

interface IConfirmationFooterProps {
  cancelLabel?: string;
  proceedLabel?: string;
  onProceed: (event: SyntheticEvent) => void;
  onCancel: (event: SyntheticEvent) => void;
  isLoading?: boolean;
}

export const ConfirmationFooter: React.FC<IConfirmationFooterProps> = ({
  onProceed,
  onCancel,
  cancelLabel,
  proceedLabel,
  isLoading,
}) => {
  return (
    <Row
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1.25rem',
      }}>
      <Button style={{ marginRight: '0.5rem' }} onClick={onCancel}>
        {cancelLabel}
      </Button>
      {isLoading ? (
        <Button disabled style={{ width: '7.375rem' }}>
          <Spin indicator={<LoadingOutlined />} size="small" />
        </Button>
      ) : (
        <Button type='primary' onClick={onProceed}>
          {proceedLabel}
        </Button>
      )}
    </Row>
  );
};
