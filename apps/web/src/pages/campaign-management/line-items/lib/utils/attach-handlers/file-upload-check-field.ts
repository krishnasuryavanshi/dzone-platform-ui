import { LineItemFileUploadMap } from '../../constants';
import { LineItemFields } from '../../enums';
import { updateUploadField } from '../setup-initial-states';

export const attachUploadCheckFieldHandler = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
  toggleField: LineItemFields,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void
) => {
  const fieldMap =
    LineItemFileUploadMap[toggleField as keyof typeof LineItemFileUploadMap];

  const onChange = async (e: any) => {
    patchFormValues({
      [fieldMap.checkField]: e.target.checked,
    });

    updateUploadField(
      e.target.checked,
      patchFormValues,
      updateFormStepDetails,
      fieldMap,
      showSaveAndCloseButtonIfFileChanged
    );
  };

  updateFormStepDetails(fieldMap.section, fieldMap.checkField, { onChange });
};
