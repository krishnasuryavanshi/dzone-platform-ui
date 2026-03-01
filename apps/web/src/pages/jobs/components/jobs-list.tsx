import { type FC, useMemo } from 'react';
import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { getJobsColumns } from './jobs-columns';
import type { IJob, IJobFilters, IJobSorter } from '../lib/types';

const STATIC_CONTENT_HEIGHT = 216;

interface JobsListProps {
  jobs: IJob[];
  filters: IJobFilters;
  sorter: IJobSorter;
  onFiltersChange: (filters: IJobFilters) => void;
  onSorterChange: (sorter: IJobSorter) => void;
  onRowClick: (job: IJob) => void;
  hideLineItemColumn?: boolean;
}

export const JobsList: FC<JobsListProps> = ({
  jobs,
  filters,
  sorter,
  onFiltersChange,
  onSorterChange,
  onRowClick,
  hideLineItemColumn = false,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(STATIC_CONTENT_HEIGHT);

  const columns = useMemo(
    () => getJobsColumns({ filters, sorter, hideLineItemColumn }),
    [filters, sorter, hideLineItemColumn],
  );

  const handleChange = ({ filters: tableFilters, sorter: tableSorter }: any) => {
    onFiltersChange(tableFilters ?? {});
    const s = Array.isArray(tableSorter) ? tableSorter[0] : tableSorter;
    onSorterChange({ field: s?.field as string, order: s?.order });
  };

  return (
    <BasicTable
      className="row-hover-highlight"
      columns={columns}
      data={jobs}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={onRowClick}
      handleChange={handleChange}
    />
  );
};
