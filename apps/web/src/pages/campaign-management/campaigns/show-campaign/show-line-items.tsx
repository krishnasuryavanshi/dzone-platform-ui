import { FC, useEffect, useState } from 'react';
import { Flex, Pagination } from 'antd';
import { useSearchParams } from 'react-router';
import { ILineItem } from '../../line-items/lib/types';
import { LineItemHeader } from './line-item-header';
// TODO: LineItemsList needs to be migrated from line-items/components
// import { LineItemsList } from '../../line-items/components/line-items-list';

// TODO: Replace with line-items store in 5C
// Previously used LineItemContext from '../../line-items/contexts'

// Placeholder type for Filters until table utils are migrated
type Filters = Record<string, any>;

interface IShowLineItemsProps {
  campaignId: string;
  campaignUuId: string;
  show: boolean;
}

export const ShowLineItems: FC<IShowLineItemsProps> = ({
  campaignId,
  campaignUuId,
  show,
}) => {
  // TODO: Replace with line-items store in 5C
  // const { updateList } = useContext(LineItemContext);
  const updateList: ILineItem | undefined = undefined;

  const [searchParams] = useSearchParams();
  const [campaignLineItems, setCampaignLineItems] = useState<ILineItem[]>([]);
  const [showCreateLineItem, setShowCreateLineItem] = useState<boolean>(false);
  const [refreshId, setRefreshId] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterInfo] = useState<Filters>({});

  const handelCreateLineItemForm = (isOpen: boolean) => {
    setShowCreateLineItem(isOpen);
  };

  useEffect(() => {
    fetchCampaignLineItems(currentPage, pageSize);
  }, [campaignUuId, showCreateLineItem, refreshId, currentPage, pageSize]);

  useEffect(() => {
    const refreshIdParam = searchParams.get('refresh_id');
    if (refreshIdParam) {
      setRefreshId(refreshIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (updateList) {
      setCampaignLineItems((prevList) => {
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

  const fetchCampaignLineItems = async (
    page: number = 1,
    size: number = 25,
  ) => {
    const { fetchLineItems } = await import('../../line-items/services');
    const data = await fetchLineItems(page - 1, size, campaignUuId, filterInfo);
    if (data) {
      setCampaignLineItems(data.data || []);
      setTotalRecords(data.total || 0);
    }
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize !== undefined) {
      setPageSize(newPageSize);
    }
  };

  if (!show) return null;

  return (
    <Flex vertical style={{ height: '100%' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <LineItemHeader
          showCreateLineItem={showCreateLineItem}
          handelCreateLineItemForm={handelCreateLineItemForm}
          totalLineItems={totalRecords || campaignLineItems?.length || 0}
          campaignId={campaignId}
          campaignUuId={campaignUuId}
        />
      </div>
      <Flex vertical style={{ flex: 1, overflow: 'auto' }}>
        {/* TODO: LineItemsList needs to be migrated from line-items/components */}
        {/* <LineItemsList
          list={campaignLineItems}
          hasFilters={false}
          handleFiltersChange={handleFiltersChange}
        /> */}
      </Flex>
      {totalRecords > 0 && (
        <div style={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            onChange={handlePageChange}
            showSizeChanger
          />
        </div>
      )}
    </Flex>
  );
};
