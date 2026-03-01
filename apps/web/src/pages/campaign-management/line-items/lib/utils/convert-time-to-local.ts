import { logError } from '@dzone/shared-logger';

/**
 * Converts a UTC time string to local timezone
 * @param utcTime - Time in format "2:45 PM" in UTC
 * @returns Time string in local timezone format "h:mm A"
 */
export const convertUTCTimeToLocal = (
  utcTime: string | null,
): string | null => {
  if (!utcTime) return null;

  try {
    // Parse the UTC time string (format: "2:45 PM")
    const [time, period] = utcTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }

    // Create a date object with today's date in UTC
    const utcDate = new Date();
    utcDate.setUTCHours(hour24, minutes, 0, 0);

    // Get local timezone
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Format to local time
    const localTimeString = utcDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: localTimezone,
    });

    // Ensure consistent format "h:mm A"
    return localTimeString.replace(/\s+/g, ' ').toUpperCase();
  } catch (error) {
    logError(error);
    return utcTime; // Return original if conversion fails
  }
};

/**
 * Converts a local time string to UTC
 * @param localTime - Time in format "2:45 PM" in local timezone
 * @returns Time string in UTC format "h:mm A"
 */
export const convertLocalTimeToUTC = (
  localTime: string | null,
): string | null => {
  if (!localTime) return null;

  try {
    // Parse the local time string (format: "2:45 PM")
    const [time, timePeriod] = localTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    let hour24 = hours;
    if (timePeriod === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (timePeriod === 'AM' && hours === 12) {
      hour24 = 0;
    }

    // Create a date object with today's date in local timezone
    const localDate = new Date();
    localDate.setHours(hour24, minutes, 0, 0);

    // Format to UTC time
    const utcHours = localDate.getUTCHours();
    const utcMinutes = localDate.getUTCMinutes();

    // Convert back to 12-hour format
    const isPM = utcHours >= 12;
    const displayHours =
      utcHours === 0 ? 12 : utcHours > 12 ? utcHours - 12 : utcHours;
    const displayMinutes = utcMinutes.toString().padStart(2, '0');
    const displayPeriod = isPM ? 'PM' : 'AM';

    return `${displayHours}:${displayMinutes} ${displayPeriod}`;
  } catch (error) {
    logError(error);
    return localTime; // Return original if conversion fails
  }
};
