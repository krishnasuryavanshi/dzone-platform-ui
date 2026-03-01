import {
  ApiFieldConfig,
  ColumnDetail,
  ColumnDetailsResponse,
  ColumnExtra,
} from '../types';

// Store filter URLs for columns that need dynamic options
export const FILTER_URL_MAP: Record<string, string> = {};

/**
 * Transform API response to expected column format
 */
export const transformApiResponseToColumns = (
  apiData: any,
): ColumnDetailsResponse => {
  const fields: ApiFieldConfig[] = apiData || [];

  const columns: ColumnDetail[] = fields.map((field) => {
    const column: ColumnDetail = {
      key: field.name,
      label: field.label,
      permissionKey: field.name, // Use field name as permission key
    };

    // Build extra properties
    const extra: ColumnExtra = {};

    if (field.ellipsis) extra.ellipsis = true;
    if (field.isSortable) extra.isSortable = true;
    if (field.isSearchable) extra.isSearchable = true;
    if (field.isFilterable) extra.isFilterable = true;

    // Handle filter options from URL
    if (field.isFilterable && field.url) {
      FILTER_URL_MAP[field.name] = field.url;
      extra.isFilterable = true;
      // Mark that this needs dynamic fetching
      extra.filterOptions = []; // Will be populated dynamically
    }

    // Add extra only if it has properties
    if (Object.keys(extra).length > 0) {
      column.extra = extra;
    }

    // Determine renderer type based on field type
    switch (field.type?.toLowerCase()) {
      case 'date':
        column.rendererType = 'date';
        // Pass the format from the field config to the column
        if (field.format) {
          column.format = field.format;
        }
        if (column.extra) {
          column.extra.isDateFilter = true;
          if (field.format) {
            column.extra.format = field.format;
          }
        } else {
          column.extra = {
            isDateFilter: true,
            ...(field.format ? { format: field.format } : {}),
          };
        }
        break;
      case 'datetime':
        column.rendererType = 'datetime';
        if (column.extra) {
          column.extra.isDateTimeFilter = true;
        } else {
          column.extra = { isDateTimeFilter: true };
        }
        break;
      case 'dropdown':
        // For boolean fields (Yes/No dropdowns)
        if (
          field.options?.length === 2 &&
          field.options.some((opt) => typeof opt.value === 'boolean')
        ) {
          column.rendererType = 'boolean';
        }
        break;
      case 'email':
        column.rendererType = 'text';
        break;
      case 'text':
        // Check for specific fields that should be links
        if (field.name === 'linkedinLink') {
          column.rendererType = 'link';
        } else {
          column.rendererType = 'text';
        }
        break;
    }

    return column;
  });

  return {
    columns,
  };
};
