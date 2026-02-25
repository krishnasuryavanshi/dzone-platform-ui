import { type FC } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Text, Title } from '../components';
import { Card } from '../components/layout/card';
import { Space } from '../components/layout';

interface IErrorContainerProps {
  error?: string;
  onRetry?: () => void;
}

export const ErrorContainer: FC<IErrorContainerProps> = ({
  error = 'Something went wrong.',
  onRetry,
}) => {
  return (
    <Card>
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <ExclamationCircleOutlined style={{ fontSize: '2rem', color: '#d8510f' }} />
        <Title level={5}>Error</Title>
        <Text>{error}</Text>
        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Space>
    </Card>
  );
};
