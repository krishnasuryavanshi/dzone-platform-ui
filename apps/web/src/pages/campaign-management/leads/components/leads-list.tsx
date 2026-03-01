import { BasicTable, ScreenLoader } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { createColumn } from '../../line-items/lib/utils/create-columns';
import { TableRowSelection } from 'antd/es/table/interface';
import { Flex, Tag } from 'antd';
import React, { FC, useEffect, useState, useMemo } from 'react';
import { HIDE_LEADS_COLUMNS } from '../lib/constants';
import {
  useViewLeadsPermissions,
  useLeadsColumnDetails,
  useAllFilterOptions,
} from '../lib/hooks';
import { ILead } from '../lib/types';
import { LeadValidationStatus } from '../lib/enums';
import { getStatusColor, buildDynamicColumns } from '../lib/utils';
import {
  getFilterableColumns,
  mergeFilterOptions,
} from '../lib/utils/column-helpers';

// Placeholder type for Filters until table utils are migrated
type Filters = Record<string, any>;

interface ILeadsListProps {
  isSelectable?: boolean;
  lineItemId?: string | null;
  onSelectionChange?: (trackingIds: number[]) => void;
  list: ILead[];
  hiddenColumns?: string[];
  hasFilters?: boolean;
  filterInfo?: Filters;
  onFiltersChange?: (filters: Record<string, any>) => void;
  fixedContentHeight?: number;
  handleRowClick?: (record: ILead) => void;
  highlightCurrentRow?: boolean;
}

const StaticContentHeight = 216;

export const LeadsList: FC<ILeadsListProps> = ({
  isSelectable = false,
  onSelectionChange,
  lineItemId,
  list,
  hiddenColumns,
  hasFilters,
  filterInfo: _filterInfo,
  onFiltersChange,
  handleRowClick,
  fixedContentHeight = StaticContentHeight,
  highlightCurrentRow = false,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(fixedContentHeight);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const column = createColumn(hasFilters);
  const permissionsResult = useViewLeadsPermissions();

  // Fetch dynamic column details
  const { columnDetails, isLoading: columnsLoading } = useLeadsColumnDetails(
    lineItemId || '',
  );

  // Get list of columns that need filter options
  const filterableFields = useMemo(() => {
    if (!columnDetails?.columns) return [];
    const fields = getFilterableColumns(columnDetails.columns);
    return fields;
  }, [columnDetails]);

  // Fetch filter options for those columns
  const { optionsMap } =
    useAllFilterOptions(filterableFields);

  // Merge filter options into columns
  const enhancedColumns = useMemo(() => {
    if (!columnDetails?.columns) return [];
    // Only merge if we have filter options to merge, otherwise use original columns
    if (Object.keys(optionsMap).length > 0) {
      return mergeFilterOptions(columnDetails.columns, optionsMap);
    }
    return columnDetails.columns;
  }, [columnDetails, optionsMap]);

  useEffect(() => {
    setSelectedRowKeys([]);
    onSelectionChange && onSelectionChange([]);
  }, [list]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionChange && onSelectionChange(newSelectedRowKeys as number[]);
  };

  const rowSelection: TableRowSelection<ILead> = {
    fixed: 'left',
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: 40,
    hideSelectAll: false,
    renderCell: (__, record, ___, originNode) => {
      const status = record.leadValidationStatus as LeadValidationStatus;
      const color = getStatusColor(status);
      return (
        <Flex
          align='center'
          style={{
            width: '100%',
            height: '100%',
            padding: 0,
            position: 'relative',
          }}>
          <Tag
            color={color}
            style={{
              width: '0.25rem',
              height: '100%',
              borderRadius: '0',
              margin: 0,
              padding: 0,
              display: 'inline-block',
              minHeight: '2rem',
              position: 'absolute',
              left: 0,
            }}
            title={status}
          />
          <Flex
            align='center'
            style={{
              width: '100%',
              paddingLeft: '0.75rem',
              paddingRight: '0.3rem',
            }}>
            {originNode}
          </Flex>
        </Flex>
      );
    },
  };

  // Build columns dynamically
  const columnsWithPermissions = useMemo(() => {
    if (!enhancedColumns || enhancedColumns.length === 0) {
      return [];
    }

    const dynamicColumns = buildDynamicColumns(enhancedColumns, {
      lineItemId,
      hideColumns: [...HIDE_LEADS_COLUMNS, ...(hiddenColumns || [])],
      includeLineItemColumns: true,
    });

    return dynamicColumns.map(({ label, key, extra, renderer }) =>
      column(label, key, extra, renderer),
    );
  }, [enhancedColumns, permissionsResult, lineItemId, hiddenColumns, column]);

  const handleChange = (data: any) => {
    onFiltersChange && onFiltersChange(data.filters);

    // Handle sorting
    if (data.sorter) {
      const sorter = data.sorter;
      if (sorter.field && sorter.order) {
        // Convert antd sort order to API sort order
        const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
        const sortBy = Array.isArray(sorter.field)
          ? sorter.field.join('.')
          : sorter.field;
        // We need to pass this up to the parent component
        // For now, we'll include it in the filters as special keys
        onFiltersChange &&
          onFiltersChange({
            ...data.filters,
            sortBy: [sortBy],
            sortOrder: [sortOrder],
          });
      } else {
        // Clear sorting
        const { sortBy, sortOrder, ...newFilters } = data.filters;
        onFiltersChange && onFiltersChange(newFilters);
      }
    }
  };

  const className = `${highlightCurrentRow ? 'row-hover-highlight ' : ''} ${
    isSelectable ? 'rows-selectable' : ''
  }`;

  // Show loading spinner while fetching column details
  if (columnsLoading) {
    return <ScreenLoader />;
  }

  return (
    <BasicTable
      className={className}
      columns={columnsWithPermissions}
      {...(isSelectable ? { rowSelection } : {})}
      data={list.map((item) => ({ ...item, key: item?.id }))}
      hasPagination={false}
      handleChange={handleChange}
      onClick={(record: ILead) => handleRowClick && handleRowClick(record)}
      scrollableHeight={scrollableTableHeight}
      basicDetailsClassName='basic-details-row'
      resizable={true}
    />
  );
};
