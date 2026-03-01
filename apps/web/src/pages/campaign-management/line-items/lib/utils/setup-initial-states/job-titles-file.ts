import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';

export const setUpJobTitlesFile = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const hasJobTitles = !!form.getFieldValue(LineItemFields.HasJobTitles);
  const jobTitlesFile = form.getFieldValue(LineItemFields.JobTitleListUpload);

  const hasJobTitlesFile = !!(jobTitlesFile?.id && jobTitlesFile?.fileName);

  updateJobTitleTextFields(
    hasJobTitles,
    hasJobTitlesFile,
    patchFormValues,
    updateFormStepDetails,
  );
};

export const updateJobTitleTextFields = (
  hasJobTitles: boolean,
  hasJobTitlesFile: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const props = {
    disabled: !hasJobTitles || (hasJobTitles && hasJobTitlesFile),
    rules: [
      {
        required: hasJobTitles && !hasJobTitlesFile,
      },
    ],
  };

  if (hasJobTitlesFile) {
    patchFormValues({
      [LineItemFields.JobTitles]: null,
    });
  }

  updateFormStepDetails(
    LineItemSections.JobTitleDetails,
    LineItemFields.JobTitles,
    props,
  );
};
