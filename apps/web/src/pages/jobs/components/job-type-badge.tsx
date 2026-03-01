import { type FC } from 'react';
import { Tag } from '@dzone/shared-ui';
import type { IJob } from '../lib/types';

type JobType = IJob['jobType'];

const typeConfig: Record<
  JobType,
  { color: string; backgroundColor: string; borderColor: string }
> = {
  UPSERT: { color: '#1677ff', backgroundColor: '#e6f4ff', borderColor: '#91caff' },
  VALIDATION: { color: '#722ed1', backgroundColor: '#f9f0ff', borderColor: '#d3adf7' },
  PUBLISH: { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' },
  REVALIDATION: { color: '#13c2c2', backgroundColor: '#e6fffb', borderColor: '#87e8de' },
};

export const JobTypeBadge: FC<{ jobType: JobType }> = ({ jobType }) => {
  const config = typeConfig[jobType];
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
      {jobType.replace('_', ' ')}
    </Tag>
  );
};
