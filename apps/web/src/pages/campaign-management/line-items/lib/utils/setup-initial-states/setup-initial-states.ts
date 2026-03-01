import { FormInstance } from 'antd';
import { TargetingUploadFields } from '../../constants';
import { LineItemFields, LineItemSteps } from '../../enums';
import { ICustomRangeDetails } from '../../types';
import { setUpCountRange } from './count-range';
import { setupCustomQuestionsFieldInitialState } from './custom-questions';
import { setupUploadFieldInitialState } from './file-upload-field';
import { setUpJobTitlesCheck } from './job-titles-check';
import { setUpJobTitlesText } from './job-titles-text';
import { setUpRevenueRange } from './revenue-range';
import { setupTotalCplFieldInitialState } from './total-cpl';
import { setUpJobTitlesFile } from './job-titles-file';

export const setupInitialStates = (
  step: LineItemSteps,
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
  _customRangeLimit: ICustomRangeDetails,
) => {
  switch (step) {
    case LineItemSteps.Goals:
      setupTotalCplFieldInitialState(
        form,
        patchFormValues,
        updateFormStepDetails,
      );
      break;
    case LineItemSteps.CustomQuestions:
      setupCustomQuestionsFieldInitialState(
        form,
        patchFormValues,
        updateFormStepDetails,
      );

      break;
    case LineItemSteps.Targeting:
      // strip out the job title upload fields, as its not depend on checkbox
      TargetingUploadFields.filter(
        (field) => field !== LineItemFields.JobTitleListUpload,
      ).forEach((field) => {
        setupUploadField(
          form,
          patchFormValues,
          updateFormStepDetails,
          field,
          showSaveAndCloseButtonIfFileChanged,
        );
      });

      setUpJobTitlesCheck(
        form,
        patchFormValues,
        updateFormStepDetails,
        showSaveAndCloseButtonIfFileChanged,
      );
      setUpJobTitlesText(
        form,
        patchFormValues,
        updateFormStepDetails,
        showSaveAndCloseButtonIfFileChanged,
      );
      setUpJobTitlesFile(form, patchFormValues, updateFormStepDetails);

      setUpCountRange(form, patchFormValues, updateFormStepDetails);
      setUpRevenueRange(form, patchFormValues, updateFormStepDetails);
      break;
    case LineItemSteps.DeliveryAndPacing:
      setupUploadFieldInitialState(
        form,
        patchFormValues,
        updateFormStepDetails,
        LineItemFields.DeliveryTemplate,
        showSaveAndCloseButtonIfFileChanged,
      );
      break;

    default:
      break;
  }
};

const setupUploadField = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  field: LineItemFields,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  setupUploadFieldInitialState(
    form,
    patchFormValues,
    updateFormStepDetails,
    field,
    showSaveAndCloseButtonIfFileChanged,
  );
};
