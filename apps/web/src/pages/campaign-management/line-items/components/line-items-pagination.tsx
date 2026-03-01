import { SimplePagination } from '@dzone/shared-ui';
import { FC } from 'react';

export interface ILineItemsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  setPage: (page: number, pageSize: number) => void;
}

export const LineItemsPagination: FC<ILineItemsPaginationProps> = ({
  currentPage,
  totalRecords,
  pageSize,
  setPage,
}) => {
  if (!totalRecords) return null;
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page, pageSize);
  };
  return (
    <SimplePagination
      current={currentPage}
      total={totalRecords}
      pageSize={pageSize}
      onChange={handlePaginationChange}
    />
  );
};
