import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Tooltip } from 'antd';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * Timezone abbreviation mapping
 * Maps timezone identifiers to their common abbreviations
 */
const TIMEZONE_ABBREVIATIONS: Record<string, string> = {
  // Americas
  'America/Los_Angeles': 'PST',
  'America/Denver': 'MST',
  'America/Chicago': 'CST',
  'America/New_York': 'EST',
  'America/Toronto': 'EST',
  'America/Mexico_City': 'CST',
  'America/Sao_Paulo': 'BRT',
  'America/Argentina/Buenos_Aires': 'ART',

  // Europe & Africa
  'Europe/London': 'GMT',
  'Europe/Paris': 'CET',
  'Europe/Berlin': 'CET',
  'Europe/Amsterdam': 'CET',
  'Europe/Rome': 'CET',
  'Europe/Madrid': 'CET',
  'Europe/Athens': 'EET',
  'Europe/Helsinki': 'EET',
  'Europe/Moscow': 'MSK',
  'Africa/Cairo': 'EET',
  'Africa/Johannesburg': 'SAST',
  'Africa/Nairobi': 'EAT',
  'Africa/Lagos': 'WAT',

  // Middle East & Asia
  'Asia/Dubai': 'GST',
  'Asia/Riyadh': 'AST',
  'Asia/Karachi': 'PKT',
  'Asia/Kolkata': 'IST',
  'Asia/Calcutta': 'IST',
  'Asia/Mumbai': 'IST',
  'Asia/Delhi': 'IST',
  'Asia/Colombo': 'IST',
  'Asia/Dhaka': 'BST',
  'Asia/Bangkok': 'ICT',
  'Asia/Jakarta': 'WIB',
  'Asia/Singapore': 'SGT',
  'Asia/Hong_Kong': 'HKT',
  'Asia/Shanghai': 'CST',
  'Asia/Beijing': 'CST',
  'Asia/Tokyo': 'JST',
  'Asia/Seoul': 'KST',

  // Australia & Pacific
  'Australia/Perth': 'AWST',
  'Australia/Adelaide': 'ACST',
  'Australia/Darwin': 'ACST',
  'Australia/Brisbane': 'AEST',
  'Australia/Sydney': 'AEDT',
  'Australia/Melbourne': 'AEDT',
  'Pacific/Auckland': 'NZDT',
  'Pacific/Fiji': 'FJT',
  'Pacific/Honolulu': 'HST',

  // UTC
  UTC: 'UTC',
  GMT: 'GMT',
};

/**
 * Get the user's browser timezone
 */
export const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get the timezone abbreviation (e.g., IST, PST, EST)
 */
export const getTimezoneAbbreviation = (tz?: string) => {
  const timezoneId = tz || getBrowserTimezone();

  // First check if we have a direct mapping
  if (TIMEZONE_ABBREVIATIONS[timezoneId]) {
    return TIMEZONE_ABBREVIATIONS[timezoneId];
  }

  // Check for daylight saving time variants
  const now = new Date();
  const isDST = () => {
    const jan = new Date(now.getFullYear(), 0, 1);
    const jul = new Date(now.getFullYear(), 6, 1);
    return (
      Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) !==
      now.getTimezoneOffset()
    );
  };

  // Handle US timezones with DST
  if (timezoneId === 'America/Los_Angeles') return isDST() ? 'PDT' : 'PST';
  if (timezoneId === 'America/Denver') return isDST() ? 'MDT' : 'MST';
  if (timezoneId === 'America/Chicago') return isDST() ? 'CDT' : 'CST';
  if (timezoneId === 'America/New_York') return isDST() ? 'EDT' : 'EST';
  if (timezoneId === 'America/Toronto') return isDST() ? 'EDT' : 'EST';

  // Handle European timezones with DST
  if (timezoneId === 'Europe/London') return isDST() ? 'BST' : 'GMT';
  if (
    timezoneId.startsWith('Europe/') &&
    TIMEZONE_ABBREVIATIONS[timezoneId] === 'CET'
  ) {
    return isDST() ? 'CEST' : 'CET';
  }
  if (
    timezoneId.startsWith('Europe/') &&
    TIMEZONE_ABBREVIATIONS[timezoneId] === 'EET'
  ) {
    return isDST() ? 'EEST' : 'EET';
  }

  // Handle Australian timezones with DST
  if (timezoneId === 'Australia/Sydney' || timezoneId === 'Australia/Melbourne') {
    const month = now.getMonth();
    // Australia DST is October to April (opposite of Northern Hemisphere)
    const isAustraliaDST = month >= 9 || month <= 3;
    return isAustraliaDST ? 'AEDT' : 'AEST';
  }

  // Fallback to browser's timezone name
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(now);
  const timezonePart = parts.find((part) => part.type === 'timeZoneName');

  // Try to clean up the timezone name if it's a GMT offset
  if (timezonePart) {
    const tzName = timezonePart.value;
    // If it's already a nice abbreviation, use it
    if (!tzName.includes('GMT') && tzName.length <= 4) {
      return tzName;
    }
    // Otherwise return the GMT offset format
    return tzName;
  }

  return timezoneId;
};

/**
 * Convert a UTC date to browser timezone
 */
export const convertToUserTimezone = (date: string | Date, tz?: string) => {
  const timezoneId = tz || getBrowserTimezone();

  // Check if the date string is already formatted (contains month names or AM/PM)
  if (typeof date === 'string') {
    // Check for common formatted date patterns
    const isFormatted = /[A-Za-z]{3}|AM|PM/i.test(date);

    if (isFormatted) {
      // Parse the formatted date string as UTC
      // Common formats from backend: "DD-MMM-YYYY hh:mm A"
      const formats = [
        'DD-MMM-YYYY hh:mm A',
        'DD-MMM-YYYY HH:mm',
        'DD MMM YYYY hh:mm A',
        'DD MMM YYYY HH:mm',
        'DD-MMM-YYYY',
        'DD MMM YYYY',
      ];

      // Try each format until one parses successfully
      let parsedDate = null;
      for (const fmt of formats) {
        const tryParse = dayjs.utc(date, fmt);
        if (tryParse.isValid()) {
          parsedDate = tryParse;
          break;
        }
      }

      // If parsing successful, convert to user timezone
      if (parsedDate && parsedDate.isValid()) {
        return parsedDate.tz(timezoneId);
      }
    }
  }

  // For ISO dates or Date objects, use the standard UTC conversion
  return dayjs.utc(date).tz(timezoneId);
};

/**
 * Format date with timezone info for display
 */
export const formatDateWithTimezone = (
  date: string | Date,
  format: string = 'DD-MMM-YYYY hh:mm A',
  tz?: string,
) => {
  const timezoneId = tz || getBrowserTimezone();
  return convertToUserTimezone(date, timezoneId).format(format);
};

/**
 * Render date with timezone tooltip
 */
export const renderDateWithTooltip = (
  date: string,
  displayFormat: string = 'DD MMM YYYY',
) => {
  if (!date) return null;

  const browserTz = getBrowserTimezone();
  const tzAbbr = getTimezoneAbbreviation(browserTz);

  // Display date in user's timezone
  const displayDate = formatDateWithTimezone(date, displayFormat);
  const tooltipContent = `Timezone: ${tzAbbr}`;

  return (
    <Tooltip
      title={tooltipContent}
      placement='top'
      overlayStyle={{
        opacity: 1,
        zIndex: 9999,
      }}
      overlayInnerStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
      <span>{displayDate}</span>
    </Tooltip>
  );
};

export const renderDateTimeWithTooltip = (
  date: string,
  displayFormat: string = 'DD-MMM-YYYY hh:mm A',
  showTimezoneInDisplay: boolean = false,
) => {
  if (!date) return null;

  const browserTz = getBrowserTimezone();
  const tzAbbr = getTimezoneAbbreviation(browserTz);

  // Display datetime in user's timezone
  const displayDateTime = formatDateWithTimezone(date, displayFormat);
  const displayText = showTimezoneInDisplay
    ? `${displayDateTime} ${tzAbbr}`
    : displayDateTime;

  const tooltipContent = `Timezone: ${tzAbbr}`;

  return (
    <Tooltip
      title={tooltipContent}
      placement='top'
      overlayStyle={{
        opacity: 1,
        zIndex: 9999,
      }}
      overlayInnerStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
      <span>{displayText}</span>
    </Tooltip>
  );
};
