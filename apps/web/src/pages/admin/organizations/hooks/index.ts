import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchOrganizations,
  fetchOrganization,
  fetchOrganizationTypes,
  fetchOrganizationsByType,
  createOrganization,
  updateOrganization,
} from '../services';
import type { IOrganizationFilters, IOrganizationSorter } from '../lib/types';

const QUERY_KEYS = {
  organizations: 'organizations',
  organization: 'organization',
  orgTypes: 'organization-types',
  orgsByType: 'organizations-by-type',
} as const;

/** Paginated organizations list with filters + sort. */
export const useOrganizations = (
  page: number,
  size: number,
  filters?: IOrganizationFilters,
  sorter?: IOrganizationSorter,
) =>
  useQuery({
    queryKey: [QUERY_KEYS.organizations, page, size, filters, sorter],
    queryFn: () => fetchOrganizations(page, size, filters, sorter),
  });

/** Single organization by ID. */
export const useOrganization = (organizationId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.organization, organizationId],
    queryFn: () => fetchOrganization(organizationId!),
    enabled: !!organizationId,
  });

/** Organization types for form radio group. */
export const useOrganizationTypes = () =>
  useQuery({
    queryKey: [QUERY_KEYS.orgTypes],
    queryFn: fetchOrganizationTypes,
    staleTime: 10 * 60 * 1000,
  });

/** Organizations by tenant type (used by user form). */
export const useOrganizationsByType = (tenantType?: string, userId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.orgsByType, tenantType, userId],
    queryFn: () => fetchOrganizationsByType(tenantType!, userId),
    enabled: !!tenantType,
  });

/** Create organization mutation. */
export const useCreateOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.organizations] }),
  });
};

/** Update organization mutation. */
export const useUpdateOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: string;
      payload: Record<string, any>;
    }) => updateOrganization(organizationId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.organizations] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.organization] });
    },
  });
};
