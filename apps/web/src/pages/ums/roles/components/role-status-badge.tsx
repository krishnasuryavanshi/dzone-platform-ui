import { type FC } from 'react';
import { Tag } from 'antd';
import type { IStatus } from '../lib/types';

interface IRoleStatusBadgeProps {
  status: IStatus;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'red',
};

export const RoleStatusBadge: FC<IRoleStatusBadgeProps> = ({ status }) => {
  if (!status?.value) return null;
  return (
    <Tag color={STATUS_COLORS[status.name] ?? 'default'}>{status.value}</Tag>
  );
};
