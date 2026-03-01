import { type FC } from 'react';
import { Tag } from '@dzone/shared-ui';
import type { IJob, IJobStep } from '../lib/types';

type JobStatus = IJob['status'] | IJobStep['status'];

const statusConfig: Record<
  JobStatus,
  { color: string; backgroundColor: string; borderColor: string }
> = {
  PENDING: { color: '#8c8c8c', backgroundColor: '#fafafa', borderColor: '#d9d9d9' },
  IN_PROGRESS: { color: '#1677ff', backgroundColor: '#e6f4ff', borderColor: '#91caff' },
  SUCCESS: { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' },
  FAILED: { color: '#ff4d4f', backgroundColor: '#fff2f0', borderColor: '#ffccc7' },
  CANCELLED: { color: '#faad14', backgroundColor: '#fffbe6', borderColor: '#ffe58f' },
};

export const JobStatusBadge: FC<{ status: JobStatus }> = ({ status }) => {
  const config = statusConfig[status];
  if (!config) return null;

  return (
    <Tag
      style={{
        color: config.color,
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        fontSize: '0.75rem',
        padding: '0.125rem 0.5rem',
        borderRadius: '1rem',
        flexShrink: 0,
        lineHeight: '1.4',
        marginRight: 0,
      }}>
      {status.replace('_', ' ')}
    </Tag>
  );
};
