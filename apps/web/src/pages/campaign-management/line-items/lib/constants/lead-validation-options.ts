import { LeadValidationOptions } from '../enums';

export const LeadValidationOptionsList = Object.entries(
  LeadValidationOptions,
).map(([value, label]) => ({
  label,
  value: value === 'true',
}));
