import { LeadValidationStatus } from '../enums';

export const IGNORE_VALIDATION_ERRORS_STATUSES = [
  LeadValidationStatus.InValidation,
  LeadValidationStatus.NotStarted,
  LeadValidationStatus.Scheduled,
];
