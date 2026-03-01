import { CampaignField } from '../../campaigns/lib/enums';
import { transformCollaboratorsValues } from './transform-collaborators-values';
import { transformResponseObject } from './transform-response-object';
import { transformResponseString } from './transform-response-string';
import { dateObject } from '@dzone/shared-lib';
import dayjs from 'dayjs';

export const formatCampaignFormData = (data: Record<string, any>): Record<string, any> => {
  return {
    ...data,
    [CampaignField.Status]: transformResponseString(data?.status, 'status'),
    [CampaignField.CampaignGoals]: transformResponseObject(data?.campaignGoals),
    [CampaignField.PaymentTerm]: transformResponseString(data?.paymentTerm),
    [CampaignField.InvoicingTerm]: transformResponseString(data?.invoicingTerm),
    [CampaignField.DeliveryMethod]: transformResponseString(
      data?.deliveryMethod,
    ),
    [CampaignField.DeliveryDays]: transformResponseObject(data?.deliveryDays),
    [CampaignField.AssignedTo]: data?.collaborators?.assignedTo?.map(
      transformCollaboratorsValues,
    ),
    targetStartDate: data?.targetStartDate
      ? dayjs(data?.targetStartDate)
      : null,
    targetEndDate: data?.targetEndDate ? dayjs(data?.targetEndDate) : null,
    opportunityCloseDate: data?.opportunityCloseDate
      ? dayjs(data?.opportunityCloseDate)
      : null,
    createdAt: data?.createdAt ? dayjs(data?.createdAt) : null,
    updatedAt: data?.updatedAt ? dayjs(data?.updatedAt) : null,
    actualEndDate: data?.actualEndDate ? dateObject(data?.actualEndDate) : null,
    actualStartDate: data?.actualStartDate
      ? dateObject(data?.actualStartDate)
      : null,
  };
};
