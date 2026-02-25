import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { TableProps } from 'antd/lib/table';
import { OrgStatusBadge } from './org-status-badge';
import { OrgActions } from './org-actions';
import type { IOrganization, IOrganizationFilters, IOrganizationSorter } from '../lib/types';

const STATIC_CONTENT_HEIGHT = 216;

interface IOrgListProps {
  organizations: IOrganization[];
  onToggleStatus: (org: IOrganization) => void;
  filters: IOrganizationFilters;
  sorter: IOrganizationSorter;
  onFiltersChange: (filters: IOrganizationFilters) => void;
  onSorterChange: (sorter: IOrganizationSorter) => void;
}

export const OrgList: FC<IOrgListProps> = ({
  organizations,
  onToggleStatus,
  filters: _filters,
  sorter,
  onFiltersChange,
  onSorterChange,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollableTableHeight } =
    useScrollableTableHeight(STATIC_CONTENT_HEIGHT);

  const columns: TableProps<IOrganization>['columns'] = [
    {
      title: t('Organization Name'),
      dataIndex: 'name',
      width: 300,
      ellipsis: true,
    },
    {
      title: t('Organization ID'),
      dataIndex: 'code',
      width: 200,
    },
    {
      title: t('Started On'),
      dataIndex: 'createdAt',
      width: 200,
      ellipsis: true,
      sorter: true,
      sortOrder: sorter?.field === 'createdAt' ? sorter.order : undefined,
      render: (date: string) => (date ? dayjs(date).format('MMM D, YYYY') : null),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (status: IOrganization['status']) => (
        <OrgStatusBadge status={status} />
      ),
    },
    {
      title: t('Type'),
      dataIndex: ['organizationType', 'name'],
      width: 150,
    },
    {
      title: t('CRM ID'),
      dataIndex: 'crmId',
      width: 150,
    },
    {
      title: t('Finance ID'),
      dataIndex: 'financeId',
      width: 150,
    },
    {
      title: t('Actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: IOrganization) => (
        <OrgActions record={record} onToggleStatus={onToggleStatus} />
      ),
    },
  ];

  const handleChange = ({
    filters: tableFilters,
    sorter: tableSorter,
  }: any) => {
    onFiltersChange(tableFilters ?? {});
    const s = Array.isArray(tableSorter) ? tableSorter[0] : tableSorter;
    onSorterChange({ field: s?.field as string, order: s?.order });
  };

  return (
    <BasicTable
      className="row-hover-highlight"
      columns={columns}
      data={organizations}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record) => navigate(`/organizations/${record.id}`)}
      handleChange={handleChange}
    />
  );
};
