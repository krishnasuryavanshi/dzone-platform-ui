import { LineItemFields } from '../enums';

export const DATE_FIELDS = [
  LineItemFields.LineItemTargetStartDate,
  LineItemFields.LineItemTargetEndDate,
  LineItemFields.TargetDeliveryStartDate,
];

export const EXCLUDED_DATE_FIELDS = [
  LineItemFields.UpdatedOn,
  LineItemFields.CreatedOn,
  LineItemFields.ActualStartDate,
  LineItemFields.ActualEndDate,
];

export const PACING_KEYS = [
  LineItemFields.TargetLeadGoal,
  LineItemFields.LineItemTargetStartDate,
  LineItemFields.LineItemTargetEndDate,
  LineItemFields.Pacing,
];
