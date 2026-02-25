import dayjs from 'dayjs';

export const formatDate = (date: any, outputFormat = 'YYYY-MM-DD') => {
  return dayjs(date).format(outputFormat);
};

export const dateObject = (date: string, inputFormat = 'YYYY-MM-DD') => {
  const parsed = dayjs(date, inputFormat, true);
  return parsed.isValid() ? parsed : undefined;
};
