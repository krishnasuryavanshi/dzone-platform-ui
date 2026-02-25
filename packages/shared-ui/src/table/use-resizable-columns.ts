import { useState, useEffect } from 'react';
import type { TableProps } from 'antd/lib/table';
import { ResizableTitle } from './resizable-title';

export const useResizableColumns = <T>(
  initialColumns: TableProps<T>['columns'],
  resizable: boolean = false,
) => {
  const [tableColumns, setTableColumns] = useState(initialColumns);

  useEffect(() => {
    if (resizable && initialColumns) {
      const columnsWithEllipsis = initialColumns.map((col: any) => ({
        ...col,
        ellipsis: col.ellipsis !== false,
      }));
      setTableColumns(columnsWithEllipsis);
    } else {
      setTableColumns(initialColumns);
    }
  }, [initialColumns, resizable]);

  const handleResize = (index: number, width: number) => {
    const newColumns = [...(tableColumns || [])];
    newColumns[index] = { ...newColumns[index], width };
    setTableColumns(newColumns);
  };

  const processedColumns = resizable
    ? tableColumns?.map((col: any, index: number) => ({
        ...col,
        onHeaderCell: () => ({
          width: col.width,
          onResize: (width: number) => handleResize(index, width),
        }),
      }))
    : tableColumns;

  const components = resizable
    ? { header: { cell: ResizableTitle } }
    : undefined;

  return { columns: processedColumns, components };
};
