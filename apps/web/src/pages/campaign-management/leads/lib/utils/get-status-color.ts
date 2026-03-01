import { LeadValidationStatus } from '../enums';

export const getStatusColor = (status: string) => {
  switch (status) {
    case LeadValidationStatus.InProgress:
      return '#007bff'; // Blue
    case LeadValidationStatus.Scheduled:
      return '#6c757d'; // Gray
    case LeadValidationStatus.Valid:
      return '#28a745'; // Green
    case LeadValidationStatus.Invalid:
      return '#dc3545'; // Red
    case LeadValidationStatus.InValidation:
      return '#ffc107'; // Yellow
    default:
      return '#d3d3d3'; // Default gray
  }
};
