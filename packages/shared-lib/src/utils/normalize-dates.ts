import { formatDate } from './date-util';

export const normalizeDates = (dateFields: string[], values: any) => {
  const dateFormFields: Record<string, string> = {};
  for (const field of dateFields) {
    if (values[field]) {
      dateFormFields[field] = formatDate(values[field]);
    }
  }
  return dateFormFields;
};
