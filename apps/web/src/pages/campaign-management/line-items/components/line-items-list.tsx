import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { useNavigate } from 'react-router';
import { FC } from 'react';
import { useLineItemFilterOptions } from '../lib/hooks';
import { ILineItem } from '../lib/types';
import BasicDetails from '../lib/schemas/basic-details.json';
import { useListColumns } from '../../lib/hooks';

// Placeholder type for Filters until table utils are migrated
type Filters = Record<string, any>;

interface ILineItemsListProps {
  list: ILineItem[];
  hasFilters?: boolean;
  filterInfo?: Filters;
  assignedTo?: string;
  handleFiltersChange?: (filters: Filters) => void;
}

const StaticContentHeight = 216;

export const LineItemsList: FC<ILineItemsListProps> = ({
  list,
  hasFilters,
  filterInfo,
  assignedTo = 'all',
  handleFiltersChange,
}) => {
  const navigate = useNavigate();
  const options = useLineItemFilterOptions(hasFilters, assignedTo);

  const columns = useListColumns(
    BasicDetails as any[],
    hasFilters,
    filterInfo,
    options,
  );
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: ILineItem) => {
    const showLineItemsLink = `/campaign-management/line-items/${record.id}`;
    navigate(showLineItemsLink);
  };

  const handleChange = ({ filters }: { filters: Filters }) => {
    // Handle filter changes
    if (handleFiltersChange && filters) {
      handleFiltersChange(filters);
    }
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={list}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record) => handleRowClick(record)}
      handleChange={handleChange}
    />
  );
};
