import { UploadProps } from 'antd';
import { convertToBytes } from '@dzone/shared-lib';
import { notification } from 'antd';
import { debounce } from 'lodash-es';
import { fetchLineItemFormFileUpload } from '../../services';
import {
  LineItemFields,
  LineItemFileUploadTypes,
  LineItemSections,
} from '../enums';
import { IFileUploadMeta } from '../types';

// TODO: getExtension should be added to @dzone/shared-lib
const getExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()! : '';
};

export const setupLineItemFormFileUpload = (
  fileMeta: IFileUploadMeta,
  uploadType: LineItemFileUploadTypes,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  section: LineItemSections,
  field: LineItemFields,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  const handleFileChange = (info: any) => {
    if (!isValidFile(info)) {
      updateFormStepDetails(section, field, {
        uploading: false,
        disabled: false,
      });
      patchFormValues({ [field]: null });
      return;
    }
    handleUploadApi(info.file.originFileObj as Blob);
  };

  const debouncedHandleFileChange = debounce(handleFileChange, 500);

  const getLineItemFormFieldUploadProps = (): UploadProps => {
    return {
      accept: `.${fileMeta?.file?.types.join(',.')}`,
      showUploadList: false,
      name: 'file',
      onChange(info) {
        updateFormStepDetails(section, field, {
          uploading: true,
          disabled: true,
        });
        debouncedHandleFileChange(info);
      },
      onRemove() {
        handleFileRemove();
      },
    };
  };

  const isValidFile = (info: any) => {
    const { name, size } = info.file;
    const extension = getExtension(name);
    const allowedFileSize = convertToBytes(fileMeta?.file?.size);

    let message = '';
    let hasError = false;

    if (!fileMeta?.file?.types.includes(extension.toUpperCase())) {
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

  const handleUploadApi = async (file: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      const data = await fetchLineItemFormFileUpload(formData);
      const { id, fileName } = data?.data;
      patchFormValues({ [field]: { id, fileName } });
      handleSuccessfulUpload();
      notification.success({
        message: data?.message,
      });
    } catch (error) {
      patchFormValues({ [field]: null });
    } finally {
      updateFormStepDetails(section, field, {
        uploading: false,
        disabled: false,
      });
      showSaveAndCloseButtonIfFileChanged(true);
    }
  };

  const handleFileRemove = () => {
    patchFormValues({ [field]: null });
    handleSuccessfuleFileRemove();
    showSaveAndCloseButtonIfFileChanged(true);
  };

  const handleSuccessfulUpload = () => {
    // form.onFieldsChange does not trigger when the file is uploaded
    // so we need to manually set dependant field's props
    if (field === LineItemFields.JobTitleListUpload) {
      updateFormStepDetails(
        LineItemSections.JobTitleDetails,
        LineItemFields.JobTitles,
        {
          disabled: true,
          rules: [
            {
              required: false,
            },
          ],
        },
      );
    }
  };

  const handleSuccessfuleFileRemove = () => {
    if (field === LineItemFields.JobTitleListUpload) {
      updateFormStepDetails(
        LineItemSections.JobTitleDetails,
        LineItemFields.JobTitles,
        {
          disabled: false,
          rules: [
            {
              required: true,
            },
          ],
        },
      );
    }
  };

  return { getLineItemFormFieldUploadProps };
};
