import dayjs from 'dayjs';

/**
 * Formats date fields in the payload to strings using their configured format.
 * Prevents timezone conversion issues when sending to API.
 */
export const formatDateFieldsForPayload = (
  payload: Record<string, any>,
  formConfig: Record<string, any>[],
): Record<string, any> => {
  const result = { ...payload };

  // Get all date fields from config
  const dateFields = formConfig.filter(
    (field) => field.type?.toLowerCase() === 'date',
  );

  // Format each date field if it exists in the payload
  dateFields.forEach((field) => {
    const value = result[field.name];
    if (value && dayjs.isDayjs(value)) {
      const format = field.format || 'YYYY-MM-DD';
      result[field.name] = value.format(format);
    }
  });

  return result;
};
