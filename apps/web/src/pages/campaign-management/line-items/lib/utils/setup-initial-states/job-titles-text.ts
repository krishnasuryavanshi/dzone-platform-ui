import { FormInstance } from 'antd';
import { LineItemFileUploadMap } from '../../constants';
import { LineItemFields } from '../../enums';
import { updateUploadField } from './file-upload-field';

export const setUpJobTitlesText = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  const hasJobTitles = !!form.getFieldValue(LineItemFields.HasJobTitles);
  const shouldFileUploadButtonEnabled =
    hasJobTitles && !form.getFieldValue(LineItemFields.JobTitles)?.length;

  const fieldMap =
    LineItemFileUploadMap[
      LineItemFields.JobTitleListUpload as keyof typeof LineItemFileUploadMap
    ];

  updateUploadField(
    shouldFileUploadButtonEnabled,
    patchFormValues,
    updateFormStepDetails,
    fieldMap,
    showSaveAndCloseButtonIfFileChanged,
  );
};
