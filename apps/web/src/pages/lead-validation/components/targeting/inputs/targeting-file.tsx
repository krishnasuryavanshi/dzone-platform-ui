import { type FC } from 'react';
import { Flex } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { TargetingFileUpload } from './targeting-file-upload';
import { UploadedFilePreview } from './uploaded-file-preview';

interface Props {
  value?: Record<string, any>[];
  handleRemoveFile: (file: Record<string, any>) => void;
  acceptedFileTypes?: string[];
  onFileChange: (file: Record<string, any>) => Promise<boolean>;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const TargetingFile: FC<Props> = ({
  value,
  handleRemoveFile,
  acceptedFileTypes,
  onFileChange,
  isDisabled,
  isLoading,
}) => {
  const { isReadOnly } = useValidationSettingStore();

  return (
    <Flex vertical gap="0.75rem" style={{ width: '100%' }}>
      <UploadedFilePreview
        value={value}
        handleRemoveFile={handleRemoveFile}
        isReadonly={isReadOnly}
      />
      <TargetingFileUpload
        acceptedFileTypes={acceptedFileTypes}
        onFileChange={onFileChange}
        isDisabled={isDisabled || isReadOnly}
        isLoading={isLoading}
      />
    </Flex>
  );
};
