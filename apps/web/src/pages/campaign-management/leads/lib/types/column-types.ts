export interface ColumnExtra {
  width?: number;
  ellipsis?: boolean;
  isSearchable?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
  isDateFilter?: boolean;
  isDateTimeFilter?: boolean;
  isMinLengthRequiredForSearch?: boolean;
  searchCharacterMinLength?: number;
  filterOptions?: string[];
  sortType?: 'string' | 'number' | 'date';
  format?: string; // Date format for date columns
}

export interface ColumnDetail {
  key: string;
  label: string;
  permissionKey: string;
  extra?: ColumnExtra;
  rendererType?: 'date' | 'datetime' | 'boolean' | 'link' | 'text';
  format?: string; // Date format for date type columns
}

export interface ColumnDetailsResponse {
  meta?: {
    tableName: string;
    version: number;
    lastUpdated: string;
    defaultSort?: {
      key: string;
      order: 'asc' | 'desc';
    };
    globalSearch?: {
      enabled: boolean;
      minCharacters: number;
    };
  };
  columns: ColumnDetail[];
}

// API Response Field Interface
export interface ApiFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  isRequired?: boolean;
  ellipsis?: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  url?: string;
  options?: Array<{ value: any; label: string }>;
  format?: string; // Date format for date type fields
}
