import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';
import { setUpJobTitlesFile } from './job-titles-file';
import { setUpJobTitlesText } from './job-titles-text';

export const setUpJobTitlesCheck = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  const hasJobtitles = form.getFieldValue(LineItemFields.HasJobTitles) ?? false;

  patchFormValues({
    [LineItemFields.HasJobTitles]: hasJobtitles,
  });

  updateJobTitleTextAndFileFields(
    form,
    hasJobtitles,
    patchFormValues,
    updateFormStepDetails,
    showSaveAndCloseButtonIfFileChanged,
  );
};

export const updateJobTitleTextAndFileFields = (
  form: FormInstance<any>,
  hasJobtitles: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  updateJobTitleDetailsSectionFields(
    hasJobtitles,
    patchFormValues,
    updateFormStepDetails,
  );

  setUpJobTitlesText(
    form,
    patchFormValues,
    updateFormStepDetails,
    showSaveAndCloseButtonIfFileChanged,
  );

  setUpJobTitlesFile(form, patchFormValues, updateFormStepDetails);
};

const updateJobTitleDetailsSectionFields = (
  hasJobtitles: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  let props: any = {
    hidden: !hasJobtitles,
  };

  if (!hasJobtitles) {
    patchFormValues({
      [LineItemFields.JobTitles]: [],
      [LineItemFields.JobTitleListUpload]: null,
    });
  }

  updateFormStepDetails(
    LineItemSections.JobTitleDetails,
    LineItemFields.JobTitles,
    props,
  );

  updateFormStepDetails(
    LineItemSections.JobTitleDetails,
    LineItemFields.JobTitleListUpload,
    props,
  );
};
