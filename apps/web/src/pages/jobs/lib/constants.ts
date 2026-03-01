export const PAGE_SIZE = 25;

export const TERMINAL_STATUSES = ['SUCCESS', 'FAILED', 'CANCELLED'];

export const JOB_TYPE_FILTERS = [
  { text: 'UPSERT', value: 'UPSERT' },
  { text: 'VALIDATION', value: 'VALIDATION' },
  { text: 'PUBLISH', value: 'PUBLISH' },
  { text: 'REVALIDATION', value: 'REVALIDATION' },
];

export const JOB_STATUS_FILTERS = [
  { text: 'PENDING', value: 'PENDING' },
  { text: 'IN PROGRESS', value: 'IN_PROGRESS' },
  { text: 'SUCCESS', value: 'SUCCESS' },
  { text: 'FAILED', value: 'FAILED' },
  { text: 'CANCELLED', value: 'CANCELLED' },
];
