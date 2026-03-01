import { type FC, useState } from 'react';
import { Button, Flex, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { debounce } from 'lodash-es';

interface Props {
  acceptedFileTypes?: string[];
  onFileChange: (file: any) => Promise<boolean>;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const TargetingFileUpload: FC<Props> = ({
  acceptedFileTypes,
  onFileChange,
  isDisabled,
  isLoading,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileSelectionChange = async (fileObj: Record<string, any>) => {
    setFileList(fileObj?.fileList || []);
    const isUploaded = await onFileChange(fileObj);
    if (isUploaded) setFileList([]);
  };

  const debouncedChange = debounce(handleFileSelectionChange, 1000);

  return (
    <Flex align="center" gap="0.5rem">
      <Upload
        accept={acceptedFileTypes?.length ? `.${acceptedFileTypes.join(',.')}` : ''}
        fileList={fileList}
        multiple
        onChange={debouncedChange}
        beforeUpload={() => false}
        showUploadList={false}>
        <Button type="primary" icon={<UploadOutlined />} disabled={isDisabled} loading={isLoading}>
          Upload
        </Button>
      </Upload>
    </Flex>
  );
};
