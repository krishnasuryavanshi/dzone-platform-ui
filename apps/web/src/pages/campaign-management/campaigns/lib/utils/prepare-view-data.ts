import { getCollaboratorsToShow } from '../../../lib/utils';
import { calculateDateDiffs } from '@dzone/shared-lib';
import { CampaignField } from '../enums';
import { ICampaign } from '../types';

export const prepareViewData = (
  data: ICampaign,
  options?: Record<string, any>,
) => {
  return {
    ...data,
    [CampaignField.IoNumber]: options?.restrictedFields?.includes(
      CampaignField.IoNumber,
    )
      ? null
      : data?.ioNumber,
    [CampaignField.BookedRevenue]: options?.restrictedFields?.includes(
      CampaignField.BookedRevenue,
    )
      ? null
      : data?.bookedRevenue,
    campaignGoals: data?.campaignGoals?.map(({ value }) => value),
    deliveryDays: data?.deliveryDays?.map(({ value }) => value),
    deliveryMethod: data?.deliveryMethod?.value,
    campaignDuration: calculateDateDiffs(
      data?.targetStartDate,
      data?.targetEndDate,
    ),
    invoicingTerm: data?.invoicingTerm?.value,
    paymentTerm: data?.paymentTerm?.value,
    status: data?.status?.value,
    actualStartDate: data?.targetStartDate,
    actualEndDate: data?.targetEndDate,
    collaborators: getCollaboratorsToShow(data),
  } as any; // TODO: fix type
};
