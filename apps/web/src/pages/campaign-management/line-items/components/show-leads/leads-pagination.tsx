import { SimplePagination } from '@dzone/shared-ui';
import { FC } from 'react';

interface ILeadsPaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  handlePaginationChange: (page: number, pageSize: number) => void;
}

export const LeadsPagination: FC<ILeadsPaginationProps> = ({
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
