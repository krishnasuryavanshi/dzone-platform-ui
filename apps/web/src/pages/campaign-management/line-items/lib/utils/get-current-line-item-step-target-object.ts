import { formatDate } from '@dzone/shared-lib';
import { pick } from 'lodash-es';
import { UnsavedLineItemTargetFields } from '../constants';
import { LineItemSteps } from '../enums';

export const getCurrentLineItemStepTargetObject = (
  step: number,
  values: any,
) => {
  let stepData = null;
  switch (step) {
    case LineItemSteps.BasicDetails:
      stepData = pick(
        values,
        UnsavedLineItemTargetFields[LineItemSteps.BasicDetails],
      );
      break;

    case LineItemSteps.Goals:
      stepData = pick(values, UnsavedLineItemTargetFields[LineItemSteps.Goals]);
      stepData.lineItemTargetStartDate = values?.lineItemTargetStartDate
        ? formatDate(values?.lineItemTargetStartDate)
        : null;
      stepData.lineItemTargetEndDate = values?.lineItemTargetEndDate
        ? formatDate(values?.lineItemTargetEndDate)
        : null;
      break;

    case LineItemSteps.DeliveryAndPacing:
      stepData = pick(
        values,
        UnsavedLineItemTargetFields[LineItemSteps.DeliveryAndPacing],
      );
      stepData.deliveryTemplateId = values?.deliveryTemplate?.id;
      stepData.targetDeliveryStartDate = values?.targetDeliveryStartDate
        ? formatDate(values?.targetDeliveryStartDate)
        : null;
      break;

    case LineItemSteps.CustomQuestions:
      stepData = pick(
        values,
        UnsavedLineItemTargetFields[LineItemSteps.CustomQuestions],
      );
      break;

    case LineItemSteps.Targeting:
      stepData = pick(
        values,
        UnsavedLineItemTargetFields[LineItemSteps.Targeting],
      );
      stepData.jobTitleListUploadId = values?.jobTitleFileDetails?.id;
      stepData.talUploadId = values?.talFileDetails?.id;
      stepData.suppressionUploadId = values?.suppressionFileDetails?.id;
      stepData.intentKeywordsUploadId = values?.intentKeywordFileDetails?.id;
      stepData.technologyUploadId = values?.technologyFileDetails?.id;
      break;
    default:
      break;
  }
  return stepData;
};
