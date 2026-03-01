import { useState, useEffect } from 'react';

import { fetchFilterOptions } from '../../services';
import { FILTER_URL_MAP } from './use-leads-column-details';

// Type definitions for return values
type SingleFieldReturn = {
  options: string[];
  isLoading: boolean;
  error: Error | null;
};

type MultipleFieldsReturn = {
  optionsMap: Record<string, string[]>;
  isLoading: boolean;
  errors: Record<string, Error>;
};

/**
 * Unified hook to fetch filter options for single or multiple fields
 */
export function useFilterOptions(
  fieldNames: string | string[],
): SingleFieldReturn | MultipleFieldsReturn {
  const [optionsMap, setOptionsMap] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, Error>>({});

  // Convert single field to array for consistent handling
  const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
  const isSingleField = !Array.isArray(fieldNames);

  useEffect(() => {
    const loadOptions = async () => {
      if (fields.length === 0) return;

      setIsLoading(true);
      const newOptionsMap: Record<string, string[]> = {};
      const newErrors: Record<string, Error> = {};

      await Promise.all(
        fields.map(async (fieldName) => {
          const url = FILTER_URL_MAP[fieldName];
          if (!url) return;

          try {
            const options = await fetchFilterOptions(url);
            newOptionsMap[fieldName] = options;
          } catch (err) {
            newErrors[fieldName] = err as Error;
            newOptionsMap[fieldName] = [];
          }
        }),
      );

      setOptionsMap(newOptionsMap);
      setErrors(newErrors);
      setIsLoading(false);
    };

    loadOptions();
  }, [JSON.stringify(fields)]);

  // Return single field format for backward compatibility
  if (isSingleField && fields[0]) {
    return {
      options: optionsMap[fields[0]] || [],
      isLoading,
      error: errors[fields[0]] || null,
    } as SingleFieldReturn;
  }

  // Return multiple fields format
  return {
    optionsMap,
    isLoading,
    errors,
  } as MultipleFieldsReturn;
}

// Export alias for backward compatibility with existing code
export const useAllFilterOptions = (
  fieldNames: string[],
): MultipleFieldsReturn => {
  return useFilterOptions(fieldNames) as MultipleFieldsReturn;
};
