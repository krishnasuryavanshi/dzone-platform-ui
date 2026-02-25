import { type FC } from 'react';
import { Tag } from 'antd';

interface IOrgStatusBadgeProps {
  status?: { name: string; value: string };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'red',
};

export const OrgStatusBadge: FC<IOrgStatusBadgeProps> = ({ status }) => {
  if (!status) return null;
  const color = STATUS_COLORS[status.name] ?? 'default';
  return <Tag color={color}>{status.value}</Tag>;
};
