import { sanitizeText, sanitizeTextareaInput } from './string/sanitize-string';

const isMultilineText = (text: string): boolean => {
  return /[\r\n]/.test(text);
};

export const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    if (isMultilineText(data)) {
      let sanitized = sanitizeTextareaInput(data);
      if (sanitized.match(/^\s*$/)) {
        return '';
      }
      sanitized = sanitized.replace(/^[\r\n]+|[\r\n]+$/g, '');
      return sanitized;
    }
    return sanitizeText(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeData(value)]),
    );
  }

  return data;
};
