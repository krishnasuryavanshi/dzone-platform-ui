import { type FC, useEffect, useState } from 'react';
import { Flex, Spin, Pagination } from 'antd';
import { useQueryState, hasActiveFilters } from '@dzone/shared-lib';
import { CampaignFilters } from './campaign-filters';
import { CampaignList } from './campaign-list';
import { fetchCampaigns } from '../services';
import type { ICampaign } from '../lib/types';
type Filters = Record<string, any>;

interface ICampaignListContainerProps {
  isDzoneUser?: boolean;
}

export const CampaignListContainer: FC<ICampaignListContainerProps> = ({
  isDzoneUser,
}) => {
  const [campaignList, setCampaignList] = useState<ICampaign[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading] = useState<boolean>(false);
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
      const pageNo = Number(queryState.page);
      const size = Number(queryState.pageSize);
      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
        fetchData(pageNo, size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState]);

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: pageSize },
    ]);
  };

  const goToFirstPage = () => {
    setQueryState([{ name: 'page', value: 0 }]);
  };

  const fetchData = async (page: number, size: number) => {
    const data = await fetchCampaigns(page - 1, size, filterInfo);
    setTotalRecords(data?.total);
    setCampaignList(data?.data);
  };

  const clearFilters = () => {
    setAssignedTo('all');
    setFilterInfo({});
    // reading old state
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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ height: '100%' }}>
      <CampaignFilters
        clearFilters={clearFilters}
        isSearchDisabled={isSearchDisabled}
        isRefreshDisabled={isRefreshDisabled}
        isDownloadDisabled={isDownloadDisabled}
        handleAssignedToFilterChange={handleAssignedToFilterChange}
        assignedToFilterSelectedValue={assignedTo}
        hasActiveFilters={hasActiveFilters(filterInfo)}
      />
      <Flex vertical flex={1} style={{ overflow: 'auto' }}>
        <CampaignList
          campaigns={campaignList}
          filterInfo={filterInfo}
          handleFiltersChange={handleFiltersChange}
          assignedTo={assignedTo}
          isDzoneUser={isDzoneUser}
          hasFilters
        />
      </Flex>
      {totalRecords > 0 && (
        <Flex justify="end" style={{ padding: '0.75rem' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            onChange={handlePageChange}
            showSizeChanger
          />
        </Flex>
      )}
    </Flex>
  );
};
