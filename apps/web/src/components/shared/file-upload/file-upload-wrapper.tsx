// TODO: Migrate DynamicFileUpload from dzone-ui
import { FC } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface DynamicFileUploadProps {
  fileTypeName?: string;
  uploadType?: 'single' | 'multiple';
  onUploadComplete?: (data: any) => void;
  tenantCode?: string;
  value?: any;
  [key: string]: any;
}

export const DynamicFileUpload: FC<DynamicFileUploadProps> = ({
  uploadType = 'single',
  onUploadComplete,
  value,
  ...rest
}) => (
  <Upload
    multiple={uploadType === 'multiple'}
    fileList={Array.isArray(value) ? value : value ? [value] : []}
    onChange={({ fileList }) => onUploadComplete?.(uploadType === 'multiple' ? fileList : fileList[0])}
    {...rest}
  >
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
);
