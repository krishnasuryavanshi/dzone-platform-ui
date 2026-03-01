import { Tag, Tooltip } from 'antd';
import { FC } from 'react';

export type TransformHistoryStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'FAILED'
  | 'ERROR'
  | 'SUCCESS';

interface TransformHistoryStatusBadgeProps {
  status: TransformHistoryStatus;
  errorMessage?: string | null;
}

const statusConfig: Record<
  TransformHistoryStatus,
  { color: string; text: string }
> = {
  PENDING: { color: 'default', text: 'Pending' },
  PROCESSING: { color: 'processing', text: 'Processing' },
  FAILED: { color: 'error', text: 'Failed' },
  ERROR: { color: 'error', text: 'Error' },
  SUCCESS: { color: 'success', text: 'Success' },
};

export const TransformHistoryStatusBadge: FC<
  TransformHistoryStatusBadgeProps
> = ({ status, errorMessage }) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  const hasError = (status === 'FAILED' || status === 'ERROR') && errorMessage;

  const badge = <Tag color={config.color}>{config.text}</Tag>;

  if (hasError) {
    return (
      <Tooltip title={errorMessage} placement='top'>
        {badge}
      </Tooltip>
    );
  }

  return badge;
};
