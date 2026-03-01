// Validation utilities for custom field data types
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} from 'libphonenumber-js';

// Custom date formats used across the application
export const CUSTOM_DATE_FORMATS = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'MM-DD-YYYY',
  'DD-MM-YYYY',
] as const;

export type CustomDateFormat = (typeof CUSTOM_DATE_FORMATS)[number];

export const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validateURL = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validatePhone = (value: string): boolean => {
  // First try to parse with country code
  const phoneWithCode = parsePhoneNumberFromString(value);
  if (phoneWithCode?.isValid()) {
    return true;
  }

  // Try validating with US region as fallback
  if (isValidPhoneNumber(value, 'US')) {
    return true;
  }

  return false;
};

export const validateDate = (value: string, format: string): boolean => {
  if (!format) return true;

  // Trim the value to remove any extra whitespace
  const trimmedValue = value?.trim ? value.trim() : value;

  if (!trimmedValue) return false;

  const formats: Record<string, RegExp> = {
    [CUSTOM_DATE_FORMATS[0]]: /^\d{4}-\d{2}-\d{2}$/, // 'YYYY-MM-DD'
    [CUSTOM_DATE_FORMATS[1]]: /^\d{2}\/\d{2}\/\d{4}$/, // 'DD/MM/YYYY'
    [CUSTOM_DATE_FORMATS[2]]: /^\d{2}\/\d{2}\/\d{4}$/, // 'MM/DD/YYYY'
    [CUSTOM_DATE_FORMATS[3]]: /^\d{2}-\d{2}-\d{4}$/, // 'MM-DD-YYYY'
    [CUSTOM_DATE_FORMATS[4]]: /^\d{2}-\d{2}-\d{4}$/, // 'DD-MM-YYYY'
  };

  return formats[format]?.test(trimmedValue) || false;
};

export const validateByDataType = (
  value: string,
  dataType: string,
  dateFormat?: string,
): { valid: boolean; message?: string } => {
  if (!value || (value?.trim && value?.trim() === '')) {
    return { valid: false, message: 'Value cannot be empty' };
  }

  switch (dataType) {
    case 'Number':
      return validateNumber(value)
        ? { valid: true }
        : { valid: false, message: 'Please enter a valid number' };

    case 'Email':
      return validateEmail(value)
        ? { valid: true }
        : { valid: false, message: 'Please enter a valid email address' };

    case 'URL':
      return validateURL(value)
        ? { valid: true }
        : {
            valid: false,
            message: 'Please enter a valid URL (http:// or https://)',
          };

    case 'Phone':
      return validatePhone(value)
        ? { valid: true }
        : { valid: false, message: 'Please enter a valid phone number' };

    case 'Date':
      return validateDate(value, dateFormat || '')
        ? { valid: true }
        : {
            valid: false,
            message: `Please enter a valid date in ${dateFormat} format`,
          };

    case 'Text':
    default:
      return { valid: true };
  }
};
