import type { ReactNode } from 'react';

export interface IListColumn<T> {
  field: string;
  dataIndex?: string;
  translationKey?: string;
  columnMetadata?: Record<string, any>;
  renderer?: <U>(value: U, record: T, index: number) => ReactNode;
}
