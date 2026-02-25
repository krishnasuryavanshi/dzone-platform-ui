const zeroWidthCharsRegex =
  /[\u200B\u200C\u200D\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2060\u2061\u2062\u2063\u2064\u2066\u2067\u2068\u2069\u206A\u206B\u206C\u206D\uFEFF\u00A0]+/g;
const emojiRegex =
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|\u0023\u20e3|\u3299|\u3297|\u203c|\u2049|\u00a9|\u2122|\u2139|[\u25aa-\u25ab\u2B1B\u2B1C]|\u2b06|\u231a|\u23cf|\u2600-\u26FF|\u2b50|\u2b55|\ud83c[\udc04-\udc0f]|\uFE0F|[\u2640\u2642]\uFE0F|[\u2B06\u2194\u21A9\u21AA\u25AA\u25AB\u25FE\u25FB\u26AB\u26AA])/g;
const invisibleCharsRegex =
  /[\x00-\x1F\x7F\u2000-\u200F\u2028\u2029\u205F\u2060\uFEFF\u200F\u200E\u202C\u202D]+/g;
const htmlTagsRegex = /<[^>]*>/g;

export const sanitizeText = (text: string) => {
  let sanitizedText = text.replace(zeroWidthCharsRegex, ' ');
  sanitizedText = sanitizedText.replace(invisibleCharsRegex, ' ');
  sanitizedText = sanitizedText.replace(emojiRegex, '');
  sanitizedText = sanitizedText.replace(/\s+/g, ' ');
  sanitizedText = sanitizedText.trim();
  return sanitizedText;
};

export const stripHtmlTags = (text: string): string => {
  return text.replace(htmlTagsRegex, '');
};

export const sanitizeInput = (text: string): string => {
  if (!text) return text;
  let sanitized = stripHtmlTags(text);
  sanitized = sanitized.replace(zeroWidthCharsRegex, '');
  sanitized = sanitized.replace(invisibleCharsRegex, '');
  return sanitized;
};

const invisibleCharsRegexForTextarea =
  /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u2000-\u200F\u2028\u2029\u205F\u2060\uFEFF\u200F\u200E\u202C\u202D]+/g;

export const sanitizeTextareaInput = (text: string): string => {
  if (!text) return text;
  let sanitized = stripHtmlTags(text);
  sanitized = sanitized.replace(zeroWidthCharsRegex, '');
  sanitized = sanitized.replace(invisibleCharsRegexForTextarea, '');
  return sanitized;
};
