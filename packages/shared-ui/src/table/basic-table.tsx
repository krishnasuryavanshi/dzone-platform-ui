import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd/lib/table';
import { useResizableColumns } from './use-resizable-columns';

export interface ITableProps<T> {
  style?: React.CSSProperties;
  className?: string;
  basicDetailsClassName?: string;
  columns: TableProps<T>['columns'];
  data: T[];
  hasPagination?: any;
  virtual?: boolean;
  scrollableHeight?: number | string;
  scrollableWidth?: number | string;
  onClick?: (record: T) => void;
  handleChange?: (data: any) => void;
  rowSelection?: TableProps<T>['rowSelection'];
  rowClassName?: any;
  resizable?: boolean;
  emptyText?: React.ReactNode;
}

export function BasicTable<T>({
  style,
  columns: initialColumns,
  className,
  basicDetailsClassName,
  data,
  hasPagination = false,
  virtual = true,
  scrollableHeight = 'max-content',
  scrollableWidth = 'max-content',
  rowSelection,
  onClick,
  handleChange,
  rowClassName,
  resizable = false,
  emptyText,
}: ITableProps<T>) {
  const { columns: processedColumns, components } = useResizableColumns(initialColumns, resizable);

  const onChange: TableProps<T>['onChange'] = (pagination, filters, sorter) => {
    handleChange?.({ pagination, filters, sorter });
  };

  const handleRowClick = (record: T) => {
    onClick?.(record);
  };

  return (
    <Table
      className={`table dz-table ${className || ''} ${basicDetailsClassName || ''} ${resizable ? 'resizable-columns' : ''}`}
      style={style}
      columns={processedColumns}
      components={components}
      dataSource={data}
      pagination={hasPagination}
      onChange={onChange}
      virtual={virtual}
      rowSelection={rowSelection}
      scroll={{ x: scrollableWidth, y: scrollableHeight }}
      onRow={(record) => ({ onClick: () => handleRowClick(record) })}
      rowClassName={rowClassName}
      locale={emptyText ? { emptyText } : undefined}
      sticky
    />
  );
}
