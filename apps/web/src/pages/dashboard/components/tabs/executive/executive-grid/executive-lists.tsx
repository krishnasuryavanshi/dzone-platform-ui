import { type FC } from 'react';
import { Tag } from 'antd';
import type { TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import type {
  IExcecutiveGrids,
  IExecutiveGridStatus,
} from '../../../../lib/types';
import { ExecutiveGridActions } from './executive-actions';

interface ExecutiveListsProps {
  lists: IExcecutiveGrids[];
  filterInfo: Record<string, unknown>;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
}

const StaticContentHeight = 200;

export const ExecutiveLists: FC<ExecutiveListsProps> = ({
  lists,
  filterInfo: _filterInfo,
  onFiltersChange,
}) => {
  const { t } = useTranslation();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const statusRenderer = (status: IExecutiveGridStatus) => (
    <Tag color={status?.color}>{status?.name}</Tag>
  );

  const actionsRenderer = (_val: unknown, record: IExcecutiveGrids) => (
    <ExecutiveGridActions executive={record} />
  );

  const columns: TableProps<IExcecutiveGrids>['columns'] = [
    {
      title: t('pages.executive.campaignName'),
      dataIndex: 'campaignName',
      width: 300,
      ellipsis: true,
    },
    {
      title: t('pages.executive.ioNumber'),
      dataIndex: 'ioNumber',
      width: 300,
      ellipsis: true,
    },
    {
      title: t('pages.executive.status'),
      dataIndex: 'status',
      width: 250,
      render: statusRenderer,
    },
    { title: t('pages.executive.leadsGoal'), dataIndex: 'leadsGoal' },
    {
      title: t('pages.executive.leadsDelivered'),
      dataIndex: 'leadsDelivered',
    },
    {
      title: t('pages.executive.bookedRevenue'),
      dataIndex: 'bookedRevenue',
    },
    { title: t('pages.executive.invoiced'), dataIndex: 'invoiced' },
    {
      title: t('pages.executive.valueAddLeads'),
      dataIndex: 'valueAddLeads',
    },
    {
      title: t('pages.executive.actions'),
      dataIndex: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: actionsRenderer,
    },
  ];

  const handleChange = (data: any) => {
    onFiltersChange?.(data.filters);
  };

  return (
    <BasicTable
      className="row-hover-highlight"
      style={{ marginTop: '1rem' }}
      columns={columns}
      data={lists}
      hasPagination={false}
      handleChange={handleChange}
      scrollableHeight={scrollableTableHeight}
    />
  );
};
