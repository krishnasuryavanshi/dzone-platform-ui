// TODO: Move to leads module once it's migrated (Phase 5E)
export enum LeadValidationStatus {
  NotStarted = 'Not Started',
  InValidation = 'In Validation',
  Valid = 'Valid',
  NeedsReview = 'Needs Review',
  Invalid = 'Invalid',
  SystemError = 'System Error',
  Scheduled = 'Scheduled',
  InProgress = 'In Progress',
}
