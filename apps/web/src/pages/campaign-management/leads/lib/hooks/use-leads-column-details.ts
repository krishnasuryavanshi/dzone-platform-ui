import { useState, useEffect } from 'react';

import { fetchLeadReviewFormConfig } from '../../../line-items/services';
import { ColumnDetailsResponse } from '../types';
import { transformApiResponseToColumns } from '../utils/transform-api-response';

// Re-export types for backward compatibility
export type {
  ColumnExtra,
  ColumnDetail,
  ColumnDetailsResponse,
} from '../types';

// Re-export FILTER_URL_MAP from transform utility
export { FILTER_URL_MAP } from '../utils/transform-api-response';

export const useLeadsColumnDetails = (lineItemId?: string) => {
  const [columnDetails, setColumnDetails] =
    useState<ColumnDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        setIsLoading(true);
        const response = await fetchLeadReviewFormConfig('grid', lineItemId);
        // Handle different response structures
        let dataToTransform = null;
        if (response?.data?.data) {
          dataToTransform = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          dataToTransform = response.data;
        } else if (Array.isArray(response)) {
          dataToTransform = response;
        }

        if (dataToTransform) {
          const transformedData =
            transformApiResponseToColumns(dataToTransform);
          setColumnDetails(transformedData);
        } else {
          setColumnDetails(null);
        }
      } catch (err) {
        setError(err as Error);
        setColumnDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, [lineItemId]);

  return { columnDetails, isLoading, error };
};
