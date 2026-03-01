import {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { BasicTable } from '@dzone/shared-ui';
import { Button, Tooltip, Space, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import {
  TransformHistoryStatusBadge,
  TransformHistoryStatus,
} from './transform-history-status-badge';
import {
  fetchTransformationHistory,
  TransformationHistoryItem,
  fileDownload,
} from '../../services';
import { dateRenderer } from '../../../lib/utils/renderers';

interface TransformHistoryTableProps {
  lineItemId: string;
  onPaginationChange?: (pagination: {
    current: number;
    pageSize: number;
    total: number;
  }) => void;
}

export interface TransformHistoryTableRef {
  refreshData: () => void;
  handlePageChange: (page: number, pageSize?: number) => void;
}

export const TransformHistoryTable = forwardRef<
  TransformHistoryTableRef,
  TransformHistoryTableProps
>(({ lineItemId, onPaginationChange }, ref) => {
  const [data, setData] = useState<TransformationHistoryItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        const response = await fetchTransformationHistory(
          lineItemId,
          page,
          pageSize,
        );
        if (response) {
          setData(response.data);
          const newPagination = {
            current: response.page,
            pageSize: response.size,
            total: response.total,
          };
          setPagination(newPagination);
          onPaginationChange?.(newPagination);
        }
      } catch (error) {
        notification.error({
          message: 'Failed to fetch export logs',
        });
      }
    },
    [lineItemId, onPaginationChange],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    fetchData(page, newPageSize);
  };

  useImperativeHandle(
    ref,
    () => ({
      refreshData: () => {
        fetchData(pagination.current, pagination.pageSize);
      },
      handlePageChange,
    }),
    [pagination, handlePageChange],
  );

  const handleDownload = async (fileId: string) => {
    await fileDownload(fileId);
  };

  const columns: TableProps<TransformationHistoryItem>['columns'] = [
    {
      title: 'File Name',
      dataIndex: ['file', 'filename'],
      key: 'filename',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (filename: string) => {
        if (!filename) return '-';

        return (
          <Tooltip title={filename} placement='topLeft'>
            <span
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '160px',
              }}>
              {filename}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Template Used',
      dataIndex: ['template', 'name'],
      key: 'templateName',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (templateName: string) => {
        if (!templateName) return '-';

        return (
          <Tooltip title={templateName} placement='topLeft'>
            <span
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '130px',
              }}>
              {templateName}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (
        status: TransformHistoryStatus,
        record: TransformationHistoryItem,
      ) => (
        <TransformHistoryStatusBadge
          status={status}
          errorMessage={record.errorMessage}
        />
      ),
    },
    {
      title: 'Exported',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: dateRenderer,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: TransformationHistoryItem) => (
        <Space>
          {record.status === 'SUCCESS' && record.file && (
            <Tooltip title='Download file'>
              <Button
                type='primary'
                icon={<DownloadOutlined />}
                size='small'
                onClick={() => handleDownload(record.file!.id)}>
                Download
              </Button>
            </Tooltip>
          )}
          {record.status === 'PROCESSING' && <span>Processing...</span>}
          {(record.status === 'FAILED' || record.status === 'ERROR') && (
            <span>-</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <BasicTable
      columns={columns}
      data={data}
      hasPagination={false}
      scrollableHeight={400}
      virtual={false}
      style={{ tableLayout: 'fixed', width: '100%' }}
    />
  );
});

TransformHistoryTable.displayName = 'TransformHistoryTable';
