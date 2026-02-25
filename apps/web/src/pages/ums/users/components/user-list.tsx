import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { Typography, Flex } from 'antd';
import { Link } from 'react-router';
import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { TableProps } from 'antd/lib/table';
import { UserStatusBadge } from './user-status-badge';
import { UserActions } from './user-actions';
import type { IUser } from '../lib/types';

const { Text } = Typography;
const STATIC_CONTENT_HEIGHT = 260;

interface IUserListProps {
  users: IUser[];
  onToggleStatus: (user: IUser) => void;
  onResendLink: (user: IUser) => void;
  emptyText?: React.ReactNode;
}

export const UserList: FC<IUserListProps> = ({
  users,
  onToggleStatus,
  onResendLink,
  emptyText,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollableTableHeight } =
    useScrollableTableHeight(STATIC_CONTENT_HEIGHT);

  const columns: TableProps<IUser>['columns'] = [
    {
      title: t('Username'),
      dataIndex: 'username',
      width: 300,
      render: (_: any, record: IUser) => (
        <Flex vertical>
          <Text strong>{`${record.firstName} ${record.lastName}`}</Text>
          <Text type="secondary">{record.email}</Text>
        </Flex>
      ),
    },
    {
      title: t('Roles'),
      dataIndex: 'roles',
      width: 300,
      render: (_: any, record: IUser) =>
        record.roles?.length
          ? record.roles.map((role, i) => (
              <span key={role.id}>
                <Link
                  to={`/ums/roles/${role.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {role.name}
                </Link>
                {i < record.roles.length - 1 ? ', ' : ''}
              </span>
            ))
          : null,
    },
    {
      title: t('Tenant Type'),
      dataIndex: 'type',
      width: 200,
    },
    {
      title: t('Last active on'),
      dataIndex: 'lastLoginTime',
      width: 150,
      ellipsis: true,
      render: (date: string) =>
        date ? dayjs(date).format('MMM D, YYYY') : null,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: 120,
      ellipsis: true,
      render: (status: string) => <UserStatusBadge status={status} />,
    },
    {
      title: t('Actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: IUser) => (
        <UserActions
          record={record}
          onToggleStatus={onToggleStatus}
          onResendLink={onResendLink}
        />
      ),
    },
  ];

  return (
    <BasicTable
      className="row-hover-highlight"
      columns={columns}
      data={users}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record) => {
        if (record.status !== 'Invited') navigate(`/ums/users/${record.id}`);
      }}
      emptyText={emptyText}
    />
  );
};
