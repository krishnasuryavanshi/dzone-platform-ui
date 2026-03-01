import { convertToBytes } from '@dzone/shared-lib';
import { notification } from 'antd';
import { IFileUploadMeta } from '../types';

// TODO: getExtension should be added to @dzone/shared-lib
const getExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()! : '';
};

export const isFileValid = (fileMeta: IFileUploadMeta, info: any) => {
  const { name, size } = info.file;
  const extension = getExtension(name);
  const allowedFileSize = convertToBytes(fileMeta?.file?.size);

  let message = '';
  let hasError = false;

  if (
    !fileMeta?.file?.types
      ?.map((t) => t.toLowerCase())
      .includes(extension.toLowerCase())
  ) {
    hasError = true;
    message = `Please upload a file with these extensions: ${fileMeta?.file?.types.join(
      ', ',
    )}`;
  } else if (size > allowedFileSize) {
    hasError = true;
    message = `File size should be less than ${fileMeta?.file?.size}`;
  }

  if (hasError) {
    notification.error({
      message,
    });
  }

  return !hasError;
};
