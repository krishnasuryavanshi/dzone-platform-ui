import { type FC } from 'react';
import { Tag } from 'antd';

interface IUserStatusBadgeProps {
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'green',
  Invited: 'gold',
  Deactivated: 'red',
};

export const UserStatusBadge: FC<IUserStatusBadgeProps> = ({ status }) => {
  if (!status) return null;
  return <Tag color={STATUS_COLORS[status] ?? 'default'}>{status}</Tag>;
};
