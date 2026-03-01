import { SimplePagination } from '@dzone/shared-ui';
import { FC } from 'react';

export interface ILeadsPaginationPaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  handlePaginationChange: (page: number, pageSize: number) => void;
}

export const LeadsPagination: FC<ILeadsPaginationPaginationProps> = ({
  currentPage,
  totalRecords,
  pageSize,
  handlePaginationChange,
}) => {
  return (
    <SimplePagination
      current={currentPage}
      total={totalRecords}
      pageSize={pageSize}
      onChange={handlePaginationChange}
    />
  );
};
