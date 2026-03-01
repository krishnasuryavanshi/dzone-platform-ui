import { type FC } from 'react';
import { MapFunction } from '@dzone/shared-ui';
import { FilePreview } from './file-preview';

interface Props {
  value?: Record<string, any>[];
  isReadonly?: boolean;
  handleRemoveFile: (file: Record<string, any>) => void;
}

export const UploadedFilePreview: FC<Props> = ({
  value,
  isReadonly = false,
  handleRemoveFile,
}) => {
  const renderFile = (file: Record<string, any>) => (
    <FilePreview
      key={file.id}
      file={file}
      handleRemoveFile={!isReadonly ? handleRemoveFile : undefined}
    />
  );

  if (!value?.length) return null;

  return <MapFunction items={value} renderItem={renderFile} />;
};
