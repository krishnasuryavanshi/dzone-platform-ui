import { useQuery } from '@tanstack/react-query';
import {
  fetchAllLeadValidationSettings,
  fetchLeadValidationSettingMetadata,
  fetchMarketersLeadValidationSettings,
} from '../services';

const QUERY_KEYS = {
  settings: 'lead-validation-settings',
  metadata: 'lead-validation-metadata',
  marketerSettings: 'lead-validation-marketer-settings',
} as const;

export const useLeadValidationSettings = (page: number, size: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.settings, page, size],
    queryFn: () => fetchAllLeadValidationSettings(page, size),
  });

export const useLeadValidationMetadata = () =>
  useQuery({
    queryKey: [QUERY_KEYS.metadata],
    queryFn: fetchLeadValidationSettingMetadata,
    staleTime: 10 * 60 * 1000,
  });

export const useMarketerSettings = (tenantCode?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.marketerSettings, tenantCode],
    queryFn: () => fetchMarketersLeadValidationSettings(tenantCode!),
    enabled: !!tenantCode,
  });
