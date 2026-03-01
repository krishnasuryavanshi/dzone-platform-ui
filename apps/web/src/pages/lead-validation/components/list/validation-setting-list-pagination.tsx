import { type FC } from 'react';
import { SimplePagination } from '@dzone/shared-ui';

interface Props {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  handlePaginationChange: (page: number, pageSize: number) => void;
}

export const ValidationSettingListPagination: FC<Props> = ({
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
