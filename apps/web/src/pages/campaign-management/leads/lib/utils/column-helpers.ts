import { ColumnDetail } from '../types';

/**
 * Helper to get all columns that need filter options fetched
 */
export const getFilterableColumns = (columns: ColumnDetail[]): string[] => {
  return columns
    .filter(
      (col) =>
        col.extra?.isFilterable &&
        Array.isArray(col.extra?.filterOptions) &&
        col.extra.filterOptions.length === 0,
    )
    .map((col) => col.key);
};

/**
 * Merge fetched filter options into column definitions
 */
export const mergeFilterOptions = (
  columns: ColumnDetail[],
  optionsMap: Record<string, string[]>,
): ColumnDetail[] => {
  return columns.map((column) => {
    if (column.extra?.isFilterable && optionsMap[column.key]) {
      return {
        ...column,
        extra: {
          ...column.extra,
          filterOptions: optionsMap[column.key],
        },
      };
    }
    return column;
  });
};
