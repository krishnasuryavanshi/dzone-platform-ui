import React from 'react';
import { Flex, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Text } = Typography;

interface UploadAreaProps {
  onFileUpload: (files: FileList) => void;
  dragOver: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  acceptedFileTypes: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const UploadArea: React.FC<UploadAreaProps> = () => {
  return (
    <Dragger>
      <Flex vertical>
        <UploadOutlined />
        <Text className='ant-upload-text'>
          Drop file to upload or <a>browse</a>
        </Text>
      </Flex>
    </Dragger>
  );
};
