import { TargetingUploadFields } from '../../constants';
import { LineItemFields, LineItemSections, LineItemSteps } from '../../enums';
import { attachDeliveryMethodHandler } from './attach-delivery-method-handler';
import { attachUploadCheckFieldHandler } from './file-upload-check-field';
import { attachHasCustomQuestionsFieldHandler } from './has-custom-questions';
import { isCountCustomRange } from './is-count-custom-range';
import { isRevenueCustomRange } from './is-revenue-custom-range';
import { attachIsValueAddLineItemHandler } from './is-value-add-leads';
import { ICustomRangeDetails } from '../../types';

import { FormInstance } from 'antd';
import { createCustomRangeValidator } from './custom-range-validator';
import { hasJobTitles } from './has-job-titles';
import { hasJobTitlesText } from './has-job-titles-text';
import { fieldValidationHandler } from '../../../../lib/utils';

const validatorsConfig = [
  {
    section: LineItemSections.CompanySizeCount,
    minField: LineItemFields.CompanySizeEmployeeCountCustomRangeMin,
    maxField: LineItemFields.CompanySizeEmployeeCountCustomRangeMax,
  },
  {
    section: LineItemSections.CompanySizeRevenue,
    minField: LineItemFields.CompanySizeRevenueCustomRangeMin,
    maxField: LineItemFields.CompanySizeRevenueCustomRangeMax,
  },
];

export const attachFieldHandlers = (
  step: LineItemSteps,
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
  customRangeLimit: ICustomRangeDetails,
  form: FormInstance,
) => {
  switch (step) {
    case LineItemSteps.BasicDetails:
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.LineItemDetails,
        LineItemFields.LineItemName,
      );
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.LineItemDetails,
        LineItemFields.LineItemIdNumber,
      );
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.LineItemDetails,
        LineItemFields.Status,
      );
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.LineItemDetails,
        LineItemFields.PONumber,
      );
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.Assets,
        LineItemFields.ProofLinks,
      );
      break;
    case LineItemSteps.Goals:
      attachIsValueAddLineItemHandler(patchFormValues, updateFormStepDetails);
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.Goals,
        LineItemFields.AdditionalInstructions,
      );
      break;
    case LineItemSteps.CustomQuestions:
      attachHasCustomQuestionsFieldHandler(
        patchFormValues,
        updateFormStepDetails,
      );
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.CustomQuestions,
        LineItemFields.CustomQuestionInstructions,
      );
      break;
    case LineItemSteps.Targeting:
      // strip out the job title upload fields, as its not depend on checkbox
      TargetingUploadFields.filter(
        (field) => field !== LineItemFields.JobTitleListUpload,
      ).forEach((field) => {
        attachUploadCheckFieldHandler(
          patchFormValues,
          updateFormStepDetails,
          field,
          showSaveAndCloseButtonIfFileChanged,
        );
      });
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.Contact,
        LineItemFields.JobTitles,
      );

      hasJobTitles(
        form,
        patchFormValues,
        updateFormStepDetails,
        showSaveAndCloseButtonIfFileChanged,
      );
      hasJobTitlesText(
        patchFormValues,
        updateFormStepDetails,
        showSaveAndCloseButtonIfFileChanged,
      );
      // file change handler handled in

      isCountCustomRange(patchFormValues, updateFormStepDetails);
      isRevenueCustomRange(patchFormValues, updateFormStepDetails);
      validatorsConfig.forEach(({ section, minField, maxField }) => {
        createCustomRangeValidator(
          patchFormValues,
          updateFormStepDetails,
          section,
          minField,
          customRangeLimit,
          form,
          'min',
          maxField,
        );

        createCustomRangeValidator(
          patchFormValues,
          updateFormStepDetails,
          section,
          maxField,
          customRangeLimit,
          form,
          'max',
          minField,
        );
      });
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.AdditionalInstructions,
        LineItemFields.AdditionalInstructions,
      );
      break;
    case LineItemSteps.DeliveryAndPacing:
      attachUploadCheckFieldHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemFields.DeliveryTemplate,
        showSaveAndCloseButtonIfFileChanged,
      );
      attachDeliveryMethodHandler(patchFormValues, updateFormStepDetails);
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.Delivery,
        LineItemFields.IntegrateConverterID,
      );
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        LineItemSections.Pacing,
        LineItemFields.PacingChartLink,
      );
      break;
    default:
      break;
  }
};
