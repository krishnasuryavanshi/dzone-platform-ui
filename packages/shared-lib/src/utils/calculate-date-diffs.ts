export const calculateDateDiffs = (
  startDate?: string,
  endDate?: string,
): number | undefined => {
  if (!startDate || !endDate) return undefined;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays < 0 ? 0 : Math.ceil(diffDays);
};
