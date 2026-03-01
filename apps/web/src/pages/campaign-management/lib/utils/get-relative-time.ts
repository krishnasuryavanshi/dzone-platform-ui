import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export function getTimestampNumber(
  ts: string | number | undefined,
): number | undefined {
  if (!ts) return undefined;
  if (typeof ts === 'number') return ts;
  const num = Number(ts);
  if (!isNaN(num)) return num;
  const date = dayjs(ts);
  return date.isValid() ? date.valueOf() : undefined;
}

export function getRelativeTime(ts: string | number | undefined): string {
  const num = getTimestampNumber(ts);
  if (!num) return '—';
  return dayjs.utc(num).local().fromNow();
}
