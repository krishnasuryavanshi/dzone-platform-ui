import { CampaignField } from '../../campaigns/lib/enums';
import { LineItemFields } from '../../line-items/lib/enums';

export const FILE_KEYS: (CampaignField | LineItemFields)[] = [
  CampaignField.UploadIoFile,
];

export const UNCHANGING_KEYS: (CampaignField | LineItemFields)[] = [
  CampaignField.Status,
  CampaignField.Id,
  CampaignField.CampaignId,
  CampaignField.MarketerCode,
  CampaignField.TenantCode,
  LineItemFields.LineItemId,
  LineItemFields.LineItemIdNumber,
  LineItemFields.CampaignIdNumber,
  LineItemFields.CampaignName,
  LineItemFields.Status,
];

export const dateKeys: (CampaignField | LineItemFields)[] = [
  CampaignField.OpportunityCloseDate,
  CampaignField.TargetEndDate,
  CampaignField.TargetStartDate,
  LineItemFields.LineItemTargetEndDate,
  LineItemFields.LineItemTargetStartDate,
  LineItemFields.TargetDeliveryStartDate,
];
