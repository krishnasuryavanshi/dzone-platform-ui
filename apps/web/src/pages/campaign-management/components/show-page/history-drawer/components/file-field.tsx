import { FC } from 'react';
import { Button, Typography, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { RenderInputWithTooltip } from '../render-field-with-tooltip';

const { Text } = Typography;

interface FileFieldProps {
  fileIds: string | string[] | { value: string[] | string; isInclusion: boolean };
  fileMap: Record<string, any>;
}

export const FileField: FC<FileFieldProps> = ({ fileIds, fileMap }) => {
  const downloadFile = async (fileId: string) => {
    // fileDownload will be created in line-items/services in sub-phase 5C
    const { fileDownload } = await import('../../../../line-items/services');
    await fileDownload(fileId);
  };

  const extractIds = (input: any): string[] => {
    if (!input) return [];
    if (typeof input === 'object' && input !== null && 'value' in input) {
      if (Array.isArray(input.value)) return input.value;
      return typeof input.value === 'string' ? [input.value] : [];
    }
    if (Array.isArray(input)) return input;
    return typeof input === 'string' ? [input] : [];
  };

  const renderFileField = (fileId: string) => {
    const file = fileMap[fileId];
    return (
      <RenderInputWithTooltip
        key={fileId}
        value={file?.filename || fileId}
        suffix={
          <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Button
              style={{
                all: 'unset',
                cursor: file ? 'pointer' : 'not-allowed',
                opacity: file ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '0 4px',
              }}
              onClick={() => file && downloadFile(file.id)}
            >
              <DownloadOutlined />
            </Button>
          </Space>
        }
        tooltipTitle={file?.filename || fileId}
      />
    );
  };

  const ids = extractIds(fileIds);
  if (ids.length === 0) return <Text type="secondary">—</Text>;
  return <>{ids.map((id) => renderFileField(id))}</>;
};
