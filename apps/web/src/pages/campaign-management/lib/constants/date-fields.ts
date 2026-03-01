import { CampaignField } from '../../campaigns/lib/enums';
import { campaignDateFields } from '../../campaigns/lib/constants';
import { LineItemFields } from '../../line-items/lib/enums';
import { lineItemDateFields } from '../../line-items/lib/constants';

export const dateFields: (CampaignField | LineItemFields)[] = [
  ...campaignDateFields,
  ...lineItemDateFields,
];

export const EXCLUDED_DATE_FIELDS = [
  CampaignField.ActualStartDate,
  CampaignField.ActualEndDate,
  CampaignField.CreatedOn,
  CampaignField.UpdatedOn,
];
