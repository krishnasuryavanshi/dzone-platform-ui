import { apiClient } from '@dzone/shared-auth';
import { ApiHost } from '@dzone/shared-lib';
import type { IOrganizationFilters, IOrganizationSorter, IOrgType } from '../lib/types';

const BASE = ApiHost.RBACService;

/**
 * Build filters array from the filter object.
 * Strips null/empty values and flattens date range tuples.
 */
function buildFilters(filterInfo?: IOrganizationFilters) {
  if (!filterInfo) return [];
  return Object.entries(filterInfo)
    .filter(([, v]) => v != null && (Array.isArray(v) ? v.length > 0 : v !== ''))
    .map(([key, value]) => {
      // Date range tuple → { key, value: [from, to] }
      if (
        key === 'createdAt' &&
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === 'string'
      ) {
        return { key, value };
      }
      return { key, value };
    });
}

function buildSort(sorter?: IOrganizationSorter) {
  if (!sorter?.field || !sorter?.order) return undefined;
  return `${sorter.field},${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`;
}

/** Fetch organizations with filtering + sorting + pagination. */
export async function fetchOrganizations(
  page: number,
  size: number,
  filterInfo?: IOrganizationFilters,
  sorterInfo?: IOrganizationSorter,
) {
  const filters = buildFilters(filterInfo);
  const sort = buildSort(sorterInfo);
  const params: Record<string, any> = { page, size };
  if (sort) params.sort = sort;

  const { data } = await apiClient.post(
    `${BASE}/organizations/filter`,
    { filters },
    { params },
  );
  return data;
}

/** Fetch a single organization by ID. */
export async function fetchOrganization(organizationId: string) {
  const { data } = await apiClient.get(
    `${BASE}/organizations/${organizationId}`,
  );
  return data;
}

/** Create a new organization. */
export async function createOrganization(payload: Record<string, any>) {
  const { data } = await apiClient.post(`${BASE}/organizations`, payload);
  return data;
}

/** Update an existing organization. */
export async function updateOrganization(
  organizationId: string,
  payload: Record<string, any>,
) {
  const { data } = await apiClient.put(
    `${BASE}/organizations/${organizationId}`,
    payload,
  );
  return data;
}

/** Fetch available organization types (for form radio group). */
export async function fetchOrganizationTypes(): Promise<IOrgType[]> {
  const { data } = await apiClient.get(`${BASE}/organizations/type`);
  return data?.data ?? data ?? [];
}

/** Fetch organizations by type (used by other modules, e.g. Users). */
export async function fetchOrganizationsByType(
  types: string,
  userId?: string,
) {
  const params: Record<string, string> = { types };
  if (userId) params.userId = userId;
  const { data } = await apiClient.get(`${BASE}/organizations/types`, {
    params,
  });
  return data;
}
