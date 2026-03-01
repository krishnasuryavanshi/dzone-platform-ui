import { FormInstance } from 'antd';
import { fetchLineItemFormFileUploadMeta } from '../../../services';
import { LineItemFileUploadMap } from '../../constants';
import { LineItemFields } from '../../enums';
import { setupLineItemFormFileUpload } from '../line-item-form-file-upload';

export const setupUploadFieldInitialState = async (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  field: LineItemFields,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  const fieldMap =
    LineItemFileUploadMap[field as keyof typeof LineItemFileUploadMap];
  const checkFieldValue = !!form.getFieldValue(fieldMap.checkField);
  const checkFieldType = fieldMap.checkFieldType;

  const shouldFileUploadButtonEnabled =
    (checkFieldType === 'checkbox' && checkFieldValue) ||
    (checkFieldType === 'text' && !checkFieldValue);

  updateUploadField(
    shouldFileUploadButtonEnabled,
    patchFormValues,
    updateFormStepDetails,
    fieldMap,
    showSaveAndCloseButtonIfFileChanged,
  );
};

export const updateUploadField = async (
  shouldFileUploadButtonEnabled: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  fieldMap: any,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  let props = {
    disabled: !shouldFileUploadButtonEnabled,
    rules: [{ required: shouldFileUploadButtonEnabled }],
    uploadProps: {},
  };

  if (shouldFileUploadButtonEnabled) {
    const { data } = await fetchLineItemFormFileUploadMeta(fieldMap.uploadType);
    const fileUploadContext = setupLineItemFormFileUpload(
      data,
      fieldMap.uploadType,
      patchFormValues,
      updateFormStepDetails,
      fieldMap.section,
      fieldMap.field,
      showSaveAndCloseButtonIfFileChanged,
    );
    props.uploadProps = fileUploadContext.getLineItemFormFieldUploadProps();
  } else {
    patchFormValues({
      [fieldMap.field]: null,
    });
  }

  updateFormStepDetails(fieldMap.section, fieldMap.field, props);
};
