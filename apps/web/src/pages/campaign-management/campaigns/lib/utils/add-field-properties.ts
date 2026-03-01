import { notification, UploadProps } from 'antd';
import { CampaignFormSection, CampaignField } from '../enums';
import { uploadIoFile } from '../../services';
import { debounce, pick } from 'lodash-es';

const handleUpload = async (
  info: any,
  patchFormValues: (values: any) => void,
  isFileChanged: (changed: boolean) => void,
) => {
  try {
    const formData = new FormData();
    formData.append('file', info.file.originFileObj);
    const { data, message } = await uploadIoFile(formData);
    if (data?.id) {
      notification.success({ message });
      patchFormValues({
        [CampaignField.UploadIoFile]: pick(data, ['id', 'fileName']),
      });
      isFileChanged(true);
    }
  } catch (error) {
    isFileChanged(false);
  }
};

export const addFieldProperties = (
  updateFormStepDetails: (
    sectionName: string,
    fieldName: string,
    partialField: any,
  ) => void,
  patchFormValues: (values: any) => void,
  isFileChanged: (changed: boolean) => void,
) => {
  const debouncedHandleFileChange = debounce(handleUpload, 500);
  updateFormStepDetails(
    CampaignFormSection.CampaignDetails,
    CampaignField.UploadIoFile,
    {
      uploadProps: {
        accept: `.PDF`, // TODO: file format
        showUploadList: false,
        name: 'file',
        onChange(info) {
          debouncedHandleFileChange(info, patchFormValues, isFileChanged);
        },
      } as UploadProps,
    }
  );
};
