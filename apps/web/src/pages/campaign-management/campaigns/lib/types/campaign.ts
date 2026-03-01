import {
  IClientInfo,
  ICollaborators,
  IFileUploadInfo,
  IPicklistItem,
  IStatus,
} from '../../../lib/types';

export interface ICampaignStatus extends IStatus {}

export interface ICampaignData {
  label: string;
  value: string;
  campaignId: string;
  id: string;
  marketer: string;
  tenantCode: string;
}
export interface ICampaign {
  marketerCode: string;
  marketer: string;
  budget: number;
  id: string;
  campaignId: string;
  name: string;
  clientName?: string;
  campaignName?: string;
  ioNumber: string;
  targetStartDate: string;
  targetEndDate: string;
  actualStartDate: string;
  actualEndDate: string;
  createdAt: string;
  updatedAt: string;
  stepId: number;
  campaignDescription: string;
  bookedRevenue: number;
  tenantCode: string;
  campaignGoals: IPicklistItem[];
  invoicingTerm: IPicklistItem;
  paymentTerm: IPicklistItem;
  deliveryContact: string;
  deliveryMethod: IPicklistItem;
  deliveryDays: IPicklistItem[];
  salesforceOpportunityId: string;
  salesforceOpportunityName: string;
  salesforceOpportunityLink: string;
  opportunityCloseDate: string;
  billingSystemReferenceId: string;
  totalLineItems: number;
  lineItemsDeliveryPercentage: string;
  stepsCompletedPercentage: string;
  status: ICampaignStatus;
  collaborators: ICollaborators;
  client: IClientInfo;
  ioFileDetails: IFileUploadInfo;
  ioFileId?: string;
}
