// TODO: Migrate FileUploadModal from dzone-ui
// Source: dzone-ui/src/app/(dashboard)/components/file-upload-modal-component/file-upload-modal.tsx
import { FC } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { FileTypeSelection } from '../../lib/enums';

interface IFileUploadModalProps {
  isOpen: boolean;
  title: string;
  uploadProps: UploadProps;
  selectedFile: UploadFile;
  handleCancel: () => void;
  handleSave: () => void;
  handleTypeSelection: (value: string) => void;
  fileTypeSelection: FileTypeSelection;
  additionalContent?: React.ReactNode;
  downloadTemplateProps?: Record<string, any>;
}

/**
 * Stub component for FileUploadModal - modal for file uploads with type selection.
 * Migrate full implementation from dzone-ui.
 */
export const FileUploadModal: FC<IFileUploadModalProps> = () => {
  return null;
};
