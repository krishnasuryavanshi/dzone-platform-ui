import { UploadProps } from 'antd';
import { convertToBytes } from '@dzone/shared-lib';
import { debounce } from 'lodash-es';
import { uploadFile } from '../../services';
import { DialogStateHandler, FileHandler, IFileUploadMetaData } from '../types';
import { notification } from 'antd';

const successMessage =
  "File uploaded successfully. Processing has started — you'll be notified by email once it's completed.";

// TODO: getBaseName and getExtension need to be added to @dzone/shared-lib
const getExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()! : '';
};

const getBaseName = (fileName: string): string => {
  const parts = fileName.split('.');
  parts.pop();
  return parts.join('.');
};

const handleFileChange = (
  info: any,
  fileMeta: IFileUploadMetaData,
  handleDialogState: DialogStateHandler,
  handleSelectedFile: FileHandler,
) => {
  if (!isValidFile(info, fileMeta, handleDialogState)) {
    return;
  }
  handleSelectedFile(info.file);
};

const debouncedHandleFileChange = debounce(handleFileChange, 500);

export const getUploadProps = (
  fileMeta: IFileUploadMetaData,
  handleDialogState: DialogStateHandler,
  handleSelectedFile: FileHandler,
): UploadProps => {
  return {
    accept: `.${fileMeta?.types?.join(',.')}`,
    showUploadList: false,
    name: 'file',
    onChange(info) {
      debouncedHandleFileChange(
        info,
        fileMeta,
        handleDialogState,
        handleSelectedFile,
      );
    },
  };
};

export const isValidFile = (
  info: any,
  fileMeta: IFileUploadMetaData,
  handleDialogState: DialogStateHandler,
) => {
  const { name, size } = info.file;
  const extension = getExtension(name);
  const basename = getBaseName(name);
  const allowedFileSize = convertToBytes(fileMeta?.size);
  const fileNameRegex = new RegExp(fileMeta?.name?.regex);

  let message = '';
  let hasError = false;

  if (basename.length > fileMeta?.name?.length) {
    hasError = true;
    message = `File name should be less than ${fileMeta?.name?.length} characters`;
  } else if (!fileNameRegex.test(basename)) {
    hasError = true;
    message = `File name is invalid`;
  } else if (!fileMeta?.types.includes(extension.toUpperCase())) {
    hasError = true;
    message = `Please upload a file with these extensions: ${fileMeta?.types?.join(
      ', ',
    )}`;
  } else if (size > allowedFileSize) {
    hasError = true;
    message = `File size should be less than ${fileMeta?.size}`;
  }

  if (hasError) {
    handleDialogState({ isDialogOpen: true, dialogType: 'Error', message });

    setTimeout(() => {
      handleDialogState({
        isDialogOpen: false,
        dialogType: 'Progress',
        message: '',
      });
    }, 4000);
  }

  return !hasError;
};

export const handleUploadApi = async (
  file: Blob,
  lineItemId: string,
  type: string,
  _handleDialogState: Function,
  tenantCode: string,
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isNetNewLead', type);
    formData.append('tenantCode', tenantCode);
    formData.append('lineItemId', lineItemId);
    const data = await uploadFile(formData);
    notification.success({
      message: successMessage,
    });
    return data;
  } catch (error) {}
};
