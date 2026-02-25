export const hasActiveFilters = (
  filteredInfo: Record<string, any>,
): boolean => {
  return Object.values(filteredInfo).some(
    (value) =>
      value !== null &&
      value !== undefined &&
      (Array.isArray(value) ? value.length > 0 : value !== ''),
  );
};

export const isFilterValueActive = (value: any): boolean => {
  return (
    value !== null &&
    value !== undefined &&
    (Array.isArray(value) ? value.length > 0 : value !== '')
  );
};

export const getActiveFilters = (
  filteredInfo: Record<string, any>,
): Record<string, any> => {
  return Object.entries(filteredInfo).reduce(
    (acc, [key, value]) => {
      if (isFilterValueActive(value)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};
