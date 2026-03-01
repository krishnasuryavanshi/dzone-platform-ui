import { type FC, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { Hideable, SimplePagination } from '@dzone/shared-ui';
import { fetchExecutiveGrid } from '../../../../services';
import type { IExcecutiveGrids } from '../../../../lib/types';
import { ExecutiveLists } from './executive-lists';

export const ExecutiveGrids: FC = () => {
  const [executiveList, setExecutiveList] = useState<IExcecutiveGrids[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, unknown>>(
    {},
  );

  const fetchData = async (
    page: number,
    size: number,
    filters: Record<string, unknown>,
  ) => {
    const data = await fetchExecutiveGrid(
      page,
      size,
      filters?.status ? (filters.status as Record<string, unknown>) : null,
    );
    if (data) {
      setTotalRecords(data.total);
      setExecutiveList(data.data);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize, filteredInfo);
  }, [currentPage, pageSize, filteredInfo]);

  const handleFiltersChange = (filters: Record<string, unknown>) => {
    setFilteredInfo(filters);
    setCurrentPage(1);
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <Flex vertical style={{ marginTop: '1rem' }}>
      <ExecutiveLists
        lists={executiveList}
        filterInfo={filteredInfo}
        onFiltersChange={handleFiltersChange}
      />
      <Hideable show={totalRecords > 0}>
        <SimplePagination
          total={totalRecords}
          onChange={handlePaginationChange}
          current={currentPage}
          pageSize={pageSize}
        />
      </Hideable>
    </Flex>
  );
};
