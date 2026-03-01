/**
 * Standard field names that are reserved and cannot be used for custom fields.
 * These are the canonical field names from the system.
 */
export const STANDARD_FIELD_NAMES = [
  'first name',
  'last name',
  'email',
  'linkedin link',
  'job title',
  'job function',
  'job level',
  'company name',
  'domain',
  'industry',
  'employee size',
  'employee size (distinct)',
  'employee size link',
  'revenue size',
  'revenue size (distinct)',
  'revenue size link',
  'address link',
  'asset 1 name',
  'asset 2 name',
  'country code',
  'phone',
  'street address',
  'city',
  'state',
  'country',
  'postal code',
  'opt in',
  'double opt in',
  'asset 1 download date',
  'asset 2 download date',
  'distinctemployeesize',
  'distinctrevenuesize',
  'rfpemployeesize',
  'rfprevenuesize',
];

/**
 * Normalizes a field name for comparison by removing spaces and converting to lowercase.
 * This ensures consistent comparison regardless of formatting variations.
 */
export const normalizeFieldName = (fieldName: string): string => {
  return fieldName.toLowerCase().replace(/\s+/g, '');
};
