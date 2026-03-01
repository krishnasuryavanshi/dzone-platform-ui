import dayjs from 'dayjs';

export const dateRenderer = (date: string) => {
  if (!date) return null;
  const formatted = dayjs(date, 'YYYY-MM-DD').format('DD MMM YYYY');
  return <span>{formatted}</span>;
};
