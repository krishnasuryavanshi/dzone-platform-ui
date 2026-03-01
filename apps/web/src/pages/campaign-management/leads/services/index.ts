import { apiClient } from '@dzone/shared-auth';
import { ApiHost } from '@dzone/shared-lib';

import { IValidateLeads } from '../lib/types';

// ---------------------------------------------------------------------------
// Service host constants
// ---------------------------------------------------------------------------

const CAMPAIGN_BASE = ApiHost.CampaignService;
const PLATFORM_BASE = ApiHost.PlatformService;
const FILE_BASE = ApiHost.FileService;
const COMMON_BASE = ApiHost.CommonService;
const LEAD_ORCH_BASE = ApiHost.LeadOrchestrationService;

// ---------------------------------------------------------------------------
// Leads list
// ---------------------------------------------------------------------------

/** Fetch paginated leads, optionally scoped to a line item. */
export async function fetchLeadsList(
  page: number,
  size: number,
  tenantCode?: string,
  lineItemUuId?: string | null,
  ...extraParams: Record<string, any>[]
) {
  const params: Record<string, any> = {
    page,
    size,
    tenantCode,
    lineItemUuId,
    ...Object.assign({}, ...extraParams),
  };

  const resource = lineItemUuId
    ? `${PLATFORM_BASE}/leads/lineItems/${lineItemUuId}`
    : `${PLATFORM_BASE}/leads`;

  const { data } = await apiClient.get(resource, {
    params,
    headers: tenantCode ? { tenantCode } : undefined,
  });
  return data;
}

// ---------------------------------------------------------------------------
// Filter leads by statuses (POST with filters)
// ---------------------------------------------------------------------------

/** Fetch leads filtered by lead/validation statuses for a line item. */
export async function fetchFilteredLeadsByStatuses(
  lineItemId: string,
  page: number,
  size: number,
  tenantCode?: string,
  filters: Record<string, any>[] = [],
) {
  const { data } = await apiClient.post(
    `${CAMPAIGN_BASE}/leads/lineItems/${lineItemId}/filters`,
    { filters },
    {
      params: { page, size },
      headers: tenantCode ? { tenantCode } : undefined,
    },
  );
  return data;
}

// ---------------------------------------------------------------------------
// Export leads
// ---------------------------------------------------------------------------

/** Export all leads as a binary file (arraybuffer). */
export async function exportLeads(): Promise<{ data: any; headers: Record<string, any> }> {
  const response = await apiClient.get(`${CAMPAIGN_BASE}/exportLead/all`, {
    responseType: 'arraybuffer',
    headers: { 'Content-Type': 'blob' },
  });
  return { data: response.data, headers: response.headers as Record<string, any> };
}

/** Export filtered leads (POST). */
export async function exportFilteredLeads(
  resource: string,
  filters: Record<string, any>[] = [],
): Promise<{ data: any; headers: Record<string, any> }> {
  const response = await apiClient.post(
    `${FILE_BASE}/${resource}`,
    { filters },
    { responseType: 'arraybuffer' },
  );
  return { data: response.data, headers: response.headers as Record<string, any> };
}

/** Export leads filtered by lead and validation statuses for a line item. */
export async function exportLeadsFilteredByLeadAndValidationStatuses(
  lineItemId: string,
  filters: Record<string, any>[] = [],
): Promise<{ data: any; headers: Record<string, any> }> {
  const response = await apiClient.post(
    `${FILE_BASE}/line-items/${lineItemId}/validated-leads/export`,
    { filters },
    { responseType: 'arraybuffer' },
  );
  return { data: response.data, headers: response.headers as Record<string, any> };
}

// ---------------------------------------------------------------------------
// Export leads metadata & count
// ---------------------------------------------------------------------------

/** Fetch export leads metadata. */
export async function fetchExportLeadsMetadata() {
  const { data } = await apiClient.get(
    `${FILE_BASE}/leads/export/metadata`,
  );
  return data;
}

/** Fetch count of filtered leads for export. */
export async function fetchFilteredLeadsCount(
  filters: Record<string, any>[] = [],
) {
  const { data } = await apiClient.post(
    `${FILE_BASE}/leads/export/count`,
    { filters },
  );
  return data;
}

// ---------------------------------------------------------------------------
// Picklists / lookups
// ---------------------------------------------------------------------------

/** Fetch lead status picklist. */
export async function fetchLeadStatusList() {
  const { data } = await apiClient.get(
    `${CAMPAIGN_BASE}/lookups/leads/statuses`,
  );
  return data;
}

/** Fetch lead validation status picklist. */
export async function fetchLeadValidationStatusList() {
  const { data } = await apiClient.get(
    `${CAMPAIGN_BASE}/lookups/leads/workflow-statuses`,
  );
  return data;
}

/** Fetch return/reject reasons. */
export async function fetchReturnReasonsList() {
  const { data } = await apiClient.get(
    `${COMMON_BASE}/lookups/Leads/rejectReason`,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Search configuration
// ---------------------------------------------------------------------------

/** Fetch minimum search character length. */
export async function fetchSearchCharactersMinLength() {
  const { data } = await apiClient.get(
    `${CAMPAIGN_BASE}/leads/min-characters`,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

/** Fetch filter options for a given URL. */
export async function fetchFilterOptions(url: string): Promise<string[]> {
  try {
    // Extract the path from the URL (remove /api prefix if present)
    const path = url.replace(/^\/api\//, '');

    // Determine which service to use based on the URL
    let apiHost = PLATFORM_BASE;
    if (path.includes('common-service')) {
      apiHost = COMMON_BASE;
    } else if (path.includes('campaign-service')) {
      apiHost = CAMPAIGN_BASE;
    }

    // Extract just the endpoint path
    const resource = path.replace(
      /^(common-service|campaign-service|platform-service)\//,
      '',
    );

    const { data } = await apiClient.get(`${apiHost}/${resource}`);

    const items = Array.isArray(data) ? data : data?.data;

    if (Array.isArray(items)) {
      return items.map((item: any) => {
        if (typeof item === 'string') return item;
        return (
          item.label || item.name || item.value || item.title || String(item)
        );
      });
    }

    return [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Lead validation
// ---------------------------------------------------------------------------

/** Validate leads via the lead orchestration service. */
export async function validateLeads(requestPayload: IValidateLeads) {
  const { data } = await apiClient.post(
    `${LEAD_ORCH_BASE}/lead-validation/validate`,
    { ...requestPayload },
  );
  return data;
}
