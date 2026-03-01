import { LeadValidationStatus } from '../enums';

export const ValidationStatusColors = {
  [LeadValidationStatus.Scheduled]: {
    backgroundColor: '#E0E0E0',
    color: '#000',
  },
  [LeadValidationStatus.InProgress]: {
    backgroundColor: '#D1E7DD',
    color: '#0F5132',
  },
  [LeadValidationStatus.NotStarted]: {
    backgroundColor: '#e1dceb',
    color: '#000',
  },
  [LeadValidationStatus.InValidation]: {
    backgroundColor: '#fefed8',
    color: '#634804',
  },
  [LeadValidationStatus.Valid]: {
    backgroundColor: '#e4ffef',
    color: '#12570a',
  },
  [LeadValidationStatus.NeedsReview]: {
    backgroundColor: '#e1f7ff',
    color: '#1673a3',
  },
  [LeadValidationStatus.Invalid]: {
    backgroundColor: '#ffbaa3',
    color: '#bb3a0f',
  },
  [LeadValidationStatus.SystemError]: {
    backgroundColor: '#fedbcf',
    color: '#1e1e1e',
  },
};
