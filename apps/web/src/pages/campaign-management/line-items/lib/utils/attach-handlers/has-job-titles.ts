import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';
import { updateJobTitleTextAndFileFields } from '../setup-initial-states';

export const hasJobTitles = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  const onChange = (e: any) => {
    patchFormValues({
      [LineItemFields.HasJobTitles]: e.target.value,
    });

    updateJobTitleTextAndFileFields(
      form,
      e.target.value,
      patchFormValues,
      updateFormStepDetails,
      showSaveAndCloseButtonIfFileChanged,
    );
  };

  updateFormStepDetails(
    LineItemSections.JobTitleCheck,
    LineItemFields.HasJobTitles,
    { onChange },
  );
};
