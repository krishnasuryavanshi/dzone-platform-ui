import { FC } from 'react';
import { Col, Typography, Space, Flex } from 'antd';

const { Text, Link } = Typography;

interface IFile {
  id: string;
  filename?: string;
  fileName?: string;
  fileSize?: string;
}

interface FieldColumnProps {
  data: {
    label: string;
    value: any;
    span?: number;
    field?: string;
    viewComponent?: FC<{ label: string; value: any }>;
  };
  handleDownload?: () => void;
}

const isRenderable = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const isLongText = (value: any): boolean =>
  typeof value === 'string' && value.length > 100;

const renderValue = (value: any, _label: string): React.ReactNode | null => {
  if (isLongText(value)) {
    return <Text ellipsis={{ tooltip: value }}>{value}</Text>;
  }
  if (Array.isArray(value)) {
    const combined = value.filter((v) => typeof v !== 'object').join(', ');
    return <Text ellipsis={{ tooltip: combined }}>{combined}</Text>;
  }
  return typeof value === 'object' ? null : value;
};

const downloadFile = async (fileId: string) => {
  // fileDownload will be created in line-items/services in sub-phase 5C
  const { fileDownload } = await import('../../line-items/services');
  await fileDownload(fileId);
};

export const FieldColumn: FC<FieldColumnProps> = ({ data, handleDownload }) => {
  if (!isRenderable(data?.value)) return null;

  const { label, value, field } = data;

  const renderAssetFile = (file: IFile) => {
    const normalizedFilename = file?.filename ?? file?.fileName;
    return (
      <Flex
        key={file?.id}
        vertical={field === 'deliveryTemplateId' || field === 'ioFileId'}
        gap="0.5rem"
        style={{ width: '100%' }}
      >
        <Text style={{ wordBreak: 'break-word' }}>
          {normalizedFilename} {file?.fileSize && `(${file?.fileSize})`}
        </Text>
        <Link onClick={() => downloadFile(file?.id)} style={{ display: 'inline-block' }}>
          Download
        </Link>
      </Flex>
    );
  };

  return (
    <Col span={field === 'assetFileIds' ? 12 : data?.span || 6}>
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Text type="secondary" style={{ fontSize: '0.875rem' }}>{label}</Text>
        {field === 'assetFileIds' && Array.isArray(value) ? (
          value.map((file: IFile) => renderAssetFile(file))
        ) : field === 'deliveryTemplate' || field === 'ioFileId' ? (
          renderAssetFile(value as IFile)
        ) : (
          renderValue(data.value, data.label)
        )}
        {handleDownload && (
          <Link onClick={handleDownload} style={{ display: 'inline-block' }}>Download</Link>
        )}
      </Space>
    </Col>
  );
};
