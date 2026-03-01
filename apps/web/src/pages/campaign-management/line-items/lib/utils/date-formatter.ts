import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);

/**
 * Parse a date string from various formats and return it in the specified format
 * @param dateValue - The date value to parse (string or null/undefined)
 * @param targetFormat - The desired output format (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY')
 * @returns The formatted date string or the original value if parsing fails
 */
export const normalizeDateFormat = (
  dateValue: string | null | undefined,
  targetFormat: string,
): string | null | undefined => {
  if (!dateValue) return dateValue;

  // Common date formats to try
  const possibleFormats = [
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'MM-DD-YYYY',
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DDTHH:mm:ss.SSS',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
  ];

  // Try to parse the date with each format
  for (const format of possibleFormats) {
    const parsed = dayjs(dateValue, format, true);
    if (parsed.isValid()) {
      return parsed.format(targetFormat);
    }
  }

  // If no strict format works, try parsing the date-only part
  const dateOnly = dateValue.split('T')[0];
  for (const format of possibleFormats) {
    const parsed = dayjs(dateOnly, format, true);
    if (parsed.isValid()) {
      return parsed.format(targetFormat);
    }
  }

  // Last resort: try generic parsing
  const genericParsed = dayjs(dateValue);
  if (genericParsed.isValid()) {
    return genericParsed.format(targetFormat);
  }

  // If all parsing fails, return the original value
  return dateValue;
};
