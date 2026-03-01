import { Tag } from 'antd';
import { FC } from 'react';

type RecordStatus = 'new' | 'updated' | null;

interface RecordStatusBadgeProps {
  updatedBy?: string | null;
}

const statusConfig = {
  new: {
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    text: 'New',
  },
  updated: {
    color: '#7c7c14',
    backgroundColor: '#fefee6',
    borderColor: '#d4d476',
    text: 'Updated',
  },
};

export const getRecordStatus = (updatedBy?: string | null): RecordStatus => {
  if (!updatedBy) return 'new';
  return 'updated';
};

export const RecordStatusBadge: FC<RecordStatusBadgeProps> = ({
  updatedBy,
}) => {
  const status = getRecordStatus(updatedBy);
  if (!status) return null;

  const config = statusConfig[status];

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
      • {config.text}
    </Tag>
  );
};
