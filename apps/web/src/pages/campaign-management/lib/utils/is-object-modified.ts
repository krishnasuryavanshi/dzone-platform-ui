import { formatDate } from '@dzone/shared-lib';
import { CampaignField } from '../../campaigns/lib/enums';
import { LineItemFields } from '../../line-items/lib/enums';

const UNCHANGING_KEYS: (CampaignField | LineItemFields)[] = [
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

export const isObjectModified = (
  updated: Record<string, any>,
  original?: Record<string, any>,
  _dependencies?: Record<string, any>,
): boolean => {
  if (!original) {
    return Object.keys(updated).length > 0;
  }
  for (const key in updated) {
    if (UNCHANGING_KEYS.includes(key as CampaignField | LineItemFields)) {
      continue;
    }

    const updatedValue = updated[key];
    const originalValue = original[key];

    if (originalValue === undefined || originalValue === null) {
      if (updatedValue !== undefined && updatedValue !== null) {
        return true;
      }
    } else {
      if (isDateKey(key)) {
        if (formatDate(originalValue) !== formatDate(updatedValue)) {
          return true;
        }
      } else if (
        typeof updatedValue === 'boolean' ||
        typeof originalValue === 'boolean'
      ) {
        if (updatedValue !== originalValue) {
          return true;
        }
      } else {
        const originalStr = String(originalValue).trim().toLowerCase();
        const updatedStr = String(updatedValue).trim().toLowerCase();

        if (originalStr !== updatedStr) {
          return true;
        }
      }
    }
  }

  for (const key in original) {
    if (
      !UNCHANGING_KEYS.includes(key as CampaignField | LineItemFields) &&
      !(key in updated)
    ) {
      return true;
    }
  }

  return false;
};

const dateKeys: (CampaignField | LineItemFields)[] = [
  CampaignField.OpportunityCloseDate,
  CampaignField.TargetEndDate,
  CampaignField.TargetStartDate,
  LineItemFields.LineItemTargetEndDate,
  LineItemFields.LineItemTargetStartDate,
  LineItemFields.TargetDeliveryStartDate,
];

const isDateKey = (key: string): boolean => {
  return dateKeys.includes(key as CampaignField | LineItemFields);
};
