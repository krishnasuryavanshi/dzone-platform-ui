export const filtersArray = (filters: Record<string, any> = {}) => Object.keys(filters)
      .filter((key) => !!filters[key])
      .map((key) => {
        return {
          key,
          value: filters[key],
        };
      });
