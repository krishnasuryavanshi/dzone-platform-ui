import { calculateDateDiffs, formatDate } from '@dzone/shared-lib';
import { pick } from 'lodash-es';
import { UnsavedCampaignTargetFields } from '../constants';
import { CampaignStep } from '../enums';

export const getCurrentStepTargetObject = (step: number, values: any) => {
  let stepData = null;
  switch (step) {
    case CampaignStep.BasicInfo:
      stepData = pick(
        values,
        UnsavedCampaignTargetFields[CampaignStep.BasicInfo],
      );
      stepData.ioFileId = values?.ioFileId?.id;
      break;

    case CampaignStep.Campaign:
      stepData = pick(
        values,
        UnsavedCampaignTargetFields[CampaignStep.Campaign],
      );
      stepData.opportunityCloseDate = values?.opportunityCloseDate
        ? formatDate(values?.opportunityCloseDate)
        : null;
      break;

    case CampaignStep.Goals:
      stepData = pick(values, UnsavedCampaignTargetFields[CampaignStep.Goals]);
      stepData.targetStartDate = values?.targetStartDate
        ? formatDate(values?.targetStartDate)
        : null;
      stepData.targetEndDate = values?.targetEndDate
        ? formatDate(values?.targetEndDate)
        : null;
      stepData.campaignDuration = calculateDateDiffs(
        values?.targetStartDate,
        values?.targetEndDate,
      );
      break;

    case CampaignStep.Delivery:
      stepData = pick(
        values,
        UnsavedCampaignTargetFields[CampaignStep.Delivery],
      );
      break;

    default:
      break;
  }
  return stepData;
};
