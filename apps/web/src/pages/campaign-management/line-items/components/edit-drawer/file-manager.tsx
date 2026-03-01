import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, Modal, Upload, Checkbox, notification } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FileItem } from './file-item';
import { fileDownload } from '../../services';
import { useValidationSettingStore } from '../../../../lead-validation/stores/use-validation-settings-store';
import { fileSortAndUpload } from '../../../../lead-validation/lib/utils';
import { fetchFileUploadMetadata } from '../../../../lead-validation/services';

const { Dragger } = Upload;
const { Text } = Typography;

export interface FileItemType {
  id: string;
  name: string;
  size?: number;
  type?: string;
  isDisabled: boolean;
  selected?: boolean;
  uploadDate?: Date;
}

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  files: FileItemType[];
  onFilesChange: (files: FileItemType[]) => void;
  onSave: () => void;
  allowUpload?: boolean;
  allowDelete?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  inline?: boolean;
  onSelectionChange?: (
    fileData: Array<{ id: string; isDisabled: boolean }>,
  ) => void;
  attributeName?: string;
  fileMetadataTypeName?: string | null;
}

export const FileManager: React.FC<FileManagerProps> = ({
  isOpen,
  onClose,
  title,
  files,
  onFilesChange,
  onSave,
  allowUpload = true,
  allowDelete = true,
  acceptedFileTypes: defaultAcceptedFileTypes = ['.csv', '.xlsx', '.txt'],
  inline = false,
  fileMetadataTypeName,
}) => {
  const { settingMetadata } = useValidationSettingStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMetadata, setUploadMetadata] = useState<Record<
    string,
    any
  > | null>(null);
  const [internalFiles, setInternalFiles] = useState<FileItemType[]>([]);

  useEffect(() => {
    if (isOpen) {
      const mappedFiles = files.map((file) => ({
        ...file,
        isDisabled: file.isDisabled ?? false,
      }));
      setInternalFiles(mappedFiles);
    }
  }, [files, isOpen]);

  useEffect(() => {
    const fetchMeta = async (typeName: string) => {
      try {
        const { data } = await fetchFileUploadMetadata(typeName);
        setUploadMetadata(data || null);
      } catch (error) {
        setUploadMetadata(null);
      }
    };

    if (fileMetadataTypeName) {
      fetchMeta(fileMetadataTypeName);
    }
  }, [fileMetadataTypeName]);

  const allSelected =
    internalFiles.length > 0 && internalFiles.every((file) => !file.isDisabled);
  const someSelected = internalFiles.some((file) => !file.isDisabled);
  const isIndeterminate = someSelected && !allSelected;

  const handleSelectAll = (isSelected: boolean) => {
    const updatedFiles = internalFiles.map((file) => ({
      ...file,
      isDisabled: !isSelected,
    }));
    setInternalFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleSelectFile = (fileId: string, isSelected: boolean) => {
    const updatedFiles = internalFiles.map((file) =>
      file.id === fileId ? { ...file, isDisabled: !isSelected } : file,
    );
    setInternalFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      await fileDownload(fileId);
    } catch (error) {
      notification.error({ message: 'File download failed.' });
    }
  };

  const handleDelete = (fileId: string) => {
    const updated = internalFiles.filter((f) => f.id !== fileId);
    setInternalFiles(updated);
    onFilesChange(updated);
  };

  const handleSaveClick = () => {
    onSave();
  };

  const draggerProps: UploadProps = {
    name: 'file',
    multiple: true,
    disabled: isUploading,
    fileList: [],
    accept:
      uploadMetadata?.types
        ?.map((t: string) => `.${t.toLowerCase()}`)
        .join(',') || defaultAcceptedFileTypes.join(','),
    showUploadList: false,
    beforeUpload: () => false,
    onChange: async (info) => {
      if (info.file.status === 'removed') return;

      const { file } = info;
      const acceptedTypes =
        (uploadMetadata?.types as string[])?.map(
          (t) => `.${t.toLowerCase()}`,
        ) || defaultAcceptedFileTypes;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

      if (!acceptedTypes.includes(fileExtension)) {
        notification.error({
          message: `File type not supported. Please upload one of the following types: ${acceptedTypes.join(
            ', ',
          )}`,
        });
        return;
      }

      if (!fileMetadataTypeName) {
        notification.error({
          message: 'Cannot determine file type for upload.',
        });
        return;
      }

      const fileObject = { file: info.file, fileList: info.fileList };
      setIsUploading(true);
      try {
        const uploadedFilesResult = await fileSortAndUpload(
          fileObject as Record<string, any>,
          uploadMetadata as Record<string, any>,
          settingMetadata?.tenantCode,
          fileMetadataTypeName,
        );

        if (!uploadedFilesResult || uploadedFilesResult.length === 0) {
          throw new Error(
            'File upload failed. The server did not return any file data.',
          );
        }

        const newFiles: FileItemType[] = uploadedFilesResult.map((f: any) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          isDisabled: false,
          uploadDate: new Date(),
        }));

        const updatedFiles = [...internalFiles, ...newFiles];
        setInternalFiles(updatedFiles);
        onFilesChange(updatedFiles);
        notification.success({
          message: `File(s) uploaded successfully.`,
        });
      } catch (error: any) {
        notification.error({
          message:
            error.response?.data?.message ||
            error.message ||
            'File upload failed.',
        });
      } finally {
        setIsUploading(false);
      }
    },
  };

  const renderContent = () => (
    <Flex vertical>
      <Checkbox
        onChange={(e) => handleSelectAll(e.target.checked)}
        checked={allSelected}
        indeterminate={isIndeterminate}>
        Select All
      </Checkbox>
      {internalFiles.map((file) => (
        <FileItem
          key={file.id}
          file={{ ...file, selected: !file.isDisabled }}
          onSelect={handleSelectFile}
          onDelete={allowDelete ? handleDelete : undefined}
          onDownload={handleDownloadFile}
        />
      ))}
      {allowUpload && (
        <Dragger {...draggerProps}>
          <Flex vertical>
            <UploadOutlined />
            <Text className='ant-upload-text'>
              {isUploading ? 'Uploading...' : 'Drop file to upload or '}
              {!isUploading && <a>browse</a>}
            </Text>
          </Flex>
        </Dragger>
      )}
    </Flex>
  );

  if (inline) {
    return renderContent();
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={title}
      width={500}
      footer={
        <Flex gap='0.75rem' justify='flex-end'>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='primary' onClick={handleSaveClick}>
            Save
          </Button>
        </Flex>
      }>
      <Flex style={{ padding: '0 0 1.5rem 0' }}>{renderContent()}</Flex>
    </Modal>
  );
};
