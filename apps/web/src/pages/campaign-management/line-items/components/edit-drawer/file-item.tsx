import React, { useState } from 'react';
import { Checkbox, Flex, Typography } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { FileItemType } from './file-manager';

const { Text } = Typography;

interface FileItemProps {
  file: FileItemType;
  onSelect: (fileId: string, isDisabled: boolean) => void;
  onDelete?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onSelect,
  onDelete,
  onDownload,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Flex
      style={{
        marginBottom: '0.5rem',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        backgroundColor:
          (file.selected ?? !file.isDisabled) || isHovering
            ? '#EBF3FE'
            : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}>
      <Flex justify='space-between' align='center' style={{ width: '100%' }}>
        <Flex align='center' gap='0.75rem' style={{ flex: 1 }}>
          <Checkbox
            checked={file.selected ?? !file.isDisabled}
            onChange={(e) => onSelect(file.id, e.target.checked)}
          />
          <Flex style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                margin: 0,
              }}>
              {file.name}
            </Text>
          </Flex>
        </Flex>

        <Flex align='center' gap='0.5rem'>
          {onDelete && (
            <Flex
              style={{
                backgroundColor: '#fff',
                borderRadius: '5px',
                padding: '0.25rem 0.5rem',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
              onClick={() => onDelete(file.id)}>
              <DeleteOutlined />
            </Flex>
          )}
          {onDownload && (
            <Flex
              style={{
                backgroundColor: '#fff',
                borderRadius: '5px',
                padding: '0.25rem 0.5rem',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
              onClick={() => onDownload(file.id)}>
              <DownloadOutlined />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

