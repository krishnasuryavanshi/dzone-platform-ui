import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ColumnDetail } from '../types';
import { ColumnWidths, COLUMN_WIDTH_MAP } from '../enums/column-widths.enum';
import {
  renderDateWithTooltip,
  renderDateTimeWithTooltip,
  getBrowserTimezone,
  formatDateWithTimezone,
} from './timezone-utils';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ColumnBuilderOptions {
  searchCharacterMinLength?: number;
  lineItemId?: string | null;
  hideColumns?: string[];
  includeLineItemColumns?: boolean;
}

const renderDate = (date: string, columnKey?: string) => {
  const showTooltip = columnKey === 'createdAt' || columnKey === 'updatedAt';

  if (showTooltip) {
    return renderDateWithTooltip(date, 'DD MMM YYYY');
  }

  // For other date columns, just format without tooltip
  const browserTz = getBrowserTimezone();
  return formatDateWithTimezone(date, 'DD MMM YYYY', browserTz);
};

const renderDateTime = (date: string, columnKey?: string) => {
  const showTooltip = columnKey === 'createdAt' || columnKey === 'updatedAt';

  if (showTooltip) {
    return renderDateTimeWithTooltip(date, 'DD-MMM-YYYY hh:mm A', false);
  }

  // For other datetime columns, just format without tooltip
  const browserTz = getBrowserTimezone();
  return formatDateWithTimezone(date, 'DD-MMM-YYYY hh:mm A', browserTz);
};

const renderBoolean = (val: boolean) => {
  return val ? 'Yes' : 'No';
};

const renderLink = (val: string) => {
  if (!val) return null;
  return (
    <a href={val} target='_blank' rel='noreferrer'>
      {val}
    </a>
  );
};

const getRenderer = (rendererType?: string, columnKey?: string) => {
  switch (rendererType) {
    case 'date':
      return (date: string) => renderDate(date, columnKey);
    case 'datetime':
      return (date: string) => renderDateTime(date, columnKey);
    case 'boolean':
      return renderBoolean;
    case 'link':
      return renderLink;
    default:
      return undefined;
  }
};

// Dynamic width calculation based on column properties
const getColumnWidth = (col: ColumnDetail) => {
  const { key, extra } = col;

  // Use existing width if provided from backend
  if (extra?.width) {
    return extra.width;
  }

  // Clean up the key for matching
  const fieldName = key.toLowerCase().replace(/\./g, '').replace(/_/g, '');

  // Check if field has a specific width mapping
  const mappedWidth = COLUMN_WIDTH_MAP[fieldName];
  if (mappedWidth) {
    return mappedWidth;
  }

  // Check for partial matches
  for (const [pattern, width] of Object.entries(COLUMN_WIDTH_MAP)) {
    if (fieldName.includes(pattern)) {
      return width;
    }
  }

  // Special case for boolean renderer type
  if (col.rendererType === 'boolean') {
    return ColumnWidths.EXTRA_SMALL;
  }

  // Default width
  return ColumnWidths.STANDARD;
};

export const buildDynamicColumns = (
  columnDetails: ColumnDetail[],
  options: ColumnBuilderOptions,
) => {
  const {
    searchCharacterMinLength,
    lineItemId,
    hideColumns = [],
    includeLineItemColumns = true,
  } = options;

  return columnDetails
    .filter((col) => {
      // Filter out hidden columns
      if (hideColumns.includes(col.key)) {
        return false;
      }

      // Filter line item columns based on lineItemId
      const isLineItemColumn =
        col.key === 'lineItem.lineItemId' ||
        col.key === 'lineItemName' ||
        col.key === 'supplier';

      if (isLineItemColumn) {
        // Show line item columns only when lineItemId is null (showing all leads)
        return lineItemId === null && includeLineItemColumns;
      }

      return true;
    })
    .map((col) => {
      // Calculate dynamic width
      const dynamicWidth = getColumnWidth(col);

      const columnConfig: any = {
        key: col.key,
        label: col.label, // Keep original label unchanged
        dataIndex: col.key, // Add dataIndex for proper column mapping
        extra: {
          ...col.extra,
          // Override width with dynamic calculation, but allow backend to override if needed
          width: dynamicWidth,
        },
        renderer: getRenderer(col.rendererType, col.key),
      };

      // Add sorting support - put sorter directly in extra so it gets spread at root level
      if (col.extra?.isSortable) {
        columnConfig.extra.sorter = true;
      }

      // Add filters from column's filterOptions if available
      if (col.extra?.isFilterable && col.extra?.filterOptions) {
        columnConfig.extra.filters = col.extra.filterOptions;
      }

      // Apply search character min length if specified
      if (col.extra?.isMinLengthRequiredForSearch && searchCharacterMinLength) {
        columnConfig.extra.searchCharacterMinLength = searchCharacterMinLength;
      }

      return columnConfig;
    });
};
