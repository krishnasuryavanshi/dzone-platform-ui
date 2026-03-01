import { Hideable, SimplePagination, ScreenLoader } from '@dzone/shared-ui';
import { useQueryState, hasActiveFilters } from '@dzone/shared-lib';
import { Flex } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useLineItemStore } from '../stores';
import { ILineItem } from '../lib/types';
import { fetchLineItems } from '../services';
import { LineItemsFiltersManager } from './line-items-filters-manager';
import { LineItemsList } from './line-items-list';

// Placeholder type for Filters until table utils are migrated
type Filters = Record<string, any>;

interface ILineItemsContainerProps {}

export const LineItemsContainer: FC<ILineItemsContainerProps> = ({}) => {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId') || '';
  const { isLoading, updateList } = useLineItemStore();
  const [lineItemsList, setLineItemsList] = useState<ILineItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const { queryState, setQueryState } = useQueryState();
  const [filterInfo, setFilterInfo] = useState<Filters>({});

  const [isSearchDisabled, setIsSearchDisabled] = useState<boolean>(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(false);
  const [assignedTo, setAssignedTo] = useState('all');

  useEffect(() => {
    setIsDownloadDisabled(true);
    setIsRefreshDisabled(true);
    setIsSearchDisabled(true);
  }, []);

  useEffect(() => {
    if (queryState) {
      let { page, pageSize } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);
      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
        fetchData(pageNo, size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 }, //default page size 25 as discussed with Sougata
        ]);
      }
    }
  }, [queryState]);

  useEffect(() => {
    if (updateList) {
      setLineItemsList((prevList) => {
        const { id, status } = updateList;
        const updatedList = prevList.map((lineItem) =>
          lineItem?.id === id ? { ...lineItem, status } : lineItem,
        );
        if (!prevList.some((lineItem) => lineItem?.id === id)) {
          updatedList.push(updateList);
        }
        return updatedList;
      });
    }
  }, [updateList]);

  const handlePageChange = (page: number, pageSize?: number) => {
    const updates = [{ name: 'page', value: page }];
    if (pageSize !== undefined) {
      updates.push({ name: 'pageSize', value: pageSize });
    }
    setQueryState(updates);
  };

  const goToFirstPage = () => {
    setQueryState([{ name: 'page', value: 0 }]);
  };

  const fetchData = async (page: number, size: number) => {
    const data = await fetchLineItems(page - 1, size, campaignId, filterInfo);
    setTotalRecords(data?.total);
    setLineItemsList(data?.data);
  };

  const clearFilters = () => {
    setAssignedTo('all');
    setFilterInfo({});
    if (Object.values(filterInfo).filter((value) => value).length) {
      goToFirstPage();
    }
  };

  const handleFiltersChange = (filters: Filters) => {
    setFilterInfo(filters);
    goToFirstPage();
  };

  const handleAssignedToFilterChange = (assignedTo: string) => {
    setAssignedTo(assignedTo); // all or userId
    if (assignedTo === 'all') {
      handleFiltersChange({ ...filterInfo, assignedTo: null });
    } else {
      handleFiltersChange({
        ...filterInfo,
        assignedTo: [assignedTo],
      });
    }
  };

  if (isLoading) return <ScreenLoader />;

  return (
    <Flex vertical style={{ height: '100%' }}>
      <LineItemsFiltersManager
        clearFilters={clearFilters}
        isDownloadDisabled={isDownloadDisabled}
        isRefreshDisabled={isRefreshDisabled}
        isSearchDisabled={isSearchDisabled}
        assignedToFilterSelectedValue={assignedTo}
        handleAssignedToFilterChange={handleAssignedToFilterChange}
        hasActiveFilters={hasActiveFilters(filterInfo)}
      />
      <Flex vertical flex={1} style={{ overflow: 'auto' }}>
        <LineItemsList
          list={lineItemsList}
          filterInfo={filterInfo}
          handleFiltersChange={handleFiltersChange}
          assignedTo={assignedTo}
          hasFilters
        />
      </Flex>
      <Hideable show={totalRecords > 0}>
        <SimplePagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={handlePageChange}
        />
      </Hideable>
    </Flex>
  );
};
