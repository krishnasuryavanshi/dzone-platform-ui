import { LineItemFields } from '../../line-items/lib/enums';
import { transformCollaboratorsValues } from './transform-collaborators-values';
import { transformResponseObject } from './transform-response-object';
import { transformResponseString } from './transform-response-string';

export const formatLineItemFormData = (data: Record<string, any>): Record<string, any> => {
  return {
    ...data,
    [LineItemFields.CampaignIdNumber]: data?.campaign?.campaignId,
    [LineItemFields.CampaignId]: data?.campaign?.id,
    [LineItemFields.CampaignName]: data?.campaign?.name,
    [LineItemFields.Status]: transformResponseString(data?.status, 'status'),
    [LineItemFields.HasCustomQuestions]: data.customQuestions?.length > 0,
    [LineItemFields.Product]: transformResponseString(data?.product),
    [LineItemFields.DeliveryDays]: transformResponseObject(data?.deliveryDays),
    [LineItemFields.Pacing]: transformResponseString(data?.pacing),
    [LineItemFields.AssignedTo]: data?.collaborators?.assignedTo?.map(
      transformCollaboratorsValues,
    ),
  };
};
