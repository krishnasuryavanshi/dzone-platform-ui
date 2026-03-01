import { pick } from 'lodash-es';
import { UnsavedCampaignSourceFields } from '../constants';

export const getFormattedCampaignSourceObject = (campaign: any) => {
  const sourceObject = pick(campaign, UnsavedCampaignSourceFields);
  sourceObject.marketerCode = campaign?.marketerId;
  sourceObject.campaignGoals = campaign?.campaignGoals?.map(
    ({ name }: any) => name,
  );
  sourceObject.deliveryDays = campaign?.deliveryDays?.map(
    ({ name }: any) => name,
  );
  sourceObject.deliveryMethod = campaign?.deliveryMethod?.name;
  sourceObject.invoicingTerm = campaign?.invoicingTerm?.name;
  sourceObject.paymentTerm = campaign?.billingTerm?.name;
  sourceObject.assignedTo = campaign?.collaborators?.assignedTo?.id;

  return sourceObject;
};
