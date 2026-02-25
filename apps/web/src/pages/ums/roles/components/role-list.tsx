import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import dayjs from 'dayjs';
import type { TableProps } from 'antd/lib/table';
import { RoleStatusBadge } from './role-status-badge';
import { RoleActions } from './role-actions';
import type { IRoles, IStatus } from '../lib/types';

const STATIC_CONTENT_HEIGHT = 260;

interface IRoleListProps {
  roles: IRoles[];
  onToggleStatus: (record: IRoles) => void;
}

export const RoleList: FC<IRoleListProps> = ({ roles, onToggleStatus }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollableTableHeight } =
    useScrollableTableHeight(STATIC_CONTENT_HEIGHT);

  const columns: TableProps<IRoles>['columns'] = [
    {
      title: t('Role Name'),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: t('No. of Users'),
      dataIndex: 'users',
      ellipsis: true,
      width: 120,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: 120,
      ellipsis: true,
      render: (status: IStatus) => <RoleStatusBadge status={status} />,
    },
    {
      title: t('Type'),
      dataIndex: 'tenantType',
      ellipsis: true,
      width: 120,
    },
    {
      title: t('Last Updated'),
      dataIndex: 'updatedAt',
      width: 150,
      ellipsis: true,
      render: (date: string) =>
        date ? dayjs(date).format('MMM D, YYYY') : null,
    },
    {
      title: t('Actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: IRoles) => (
        <RoleActions record={record} onToggleStatus={onToggleStatus} />
      ),
    },
  ];

  return (
    <BasicTable
      className="row-hover-highlight"
      columns={columns}
      data={roles}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record) => {
        if (record.editable) navigate(`/ums/roles/${record.id}`);
      }}
    />
  );
};
