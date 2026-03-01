import type { TableProps } from 'antd/lib/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { JobStatusBadge } from './job-status-badge';
import { JobTypeBadge } from './job-type-badge';
import { JOB_TYPE_FILTERS, JOB_STATUS_FILTERS } from '../lib/constants';
import type { IJob, IJobFilters, IJobSorter } from '../lib/types';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (date: string) => {
  if (!date) return '-';
  return dayjs.utc(date).tz(dayjs.tz.guess()).format('DD MMM YYYY, hh:mm A');
};

interface GetJobsColumnsProps {
  filters: IJobFilters;
  sorter: IJobSorter;
  hideLineItemColumn?: boolean;
}

export const getJobsColumns = ({
  filters,
  sorter,
  hideLineItemColumn = false,
}: GetJobsColumnsProps): TableProps<IJob>['columns'] => {
  const columns: TableProps<IJob>['columns'] = [
    {
      title: 'Job ID',
      dataIndex: 'jobId',
      key: 'jobId',
      width: 150,
      ellipsis: true,
      render: (jobId: string) => jobId?.split('-').pop()?.toUpperCase(),
    },
    ...(!hideLineItemColumn
      ? [
          {
            title: 'Line Item ID',
            dataIndex: 'lineItemId',
            key: 'lineItemId',
            width: 150,
            ellipsis: true,
            filteredValue: filters.lineItemId || null,
          },
        ]
      : []),
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType',
      width: 150,
      filters: JOB_TYPE_FILTERS,
      filteredValue: filters.jobType || null,
      render: (jobType: IJob['jobType']) => <JobTypeBadge jobType={jobType} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      filters: JOB_STATUS_FILTERS,
      filteredValue: filters.status || null,
      render: (status: IJob['status']) => <JobStatusBadge status={status} />,
    },
    {
      title: 'Total',
      dataIndex: 'totalCount',
      key: 'totalCount',
      width: 150,
    },
    {
      title: 'Success',
      dataIndex: 'successCount',
      key: 'successCount',
      width: 150,
    },
    {
      title: 'Skipped',
      dataIndex: 'skippedCount',
      key: 'skippedCount',
      width: 150,
    },
    {
      title: 'Invalid',
      dataIndex: 'invalidCount',
      key: 'invalidCount',
      width: 150,
    },
    {
      title: 'Started On',
      dataIndex: 'startedAt',
      key: 'startedAt',
      width: 180,
      sorter: true,
      sortOrder: sorter?.field === 'startedAt' ? sorter.order : undefined,
      render: formatDate,
    },
    {
      title: 'Completed On',
      dataIndex: 'completedAt',
      key: 'completedAt',
      width: 180,
      render: formatDate,
    },
    {
      title: 'User',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
      filteredValue: filters.email || null,
    },
  ];

  return columns;
};
