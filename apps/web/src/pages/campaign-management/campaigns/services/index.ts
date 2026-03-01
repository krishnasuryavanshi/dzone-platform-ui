import { apiClient } from '@dzone/shared-auth';
import { ApiHost, OptionsKeys } from '@dzone/shared-lib';
import { fetchOrganizationsByType } from '../../../admin/organizations/services';

const BASE = ApiHost.CampaignService;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DateRangeValue {
  from?: string | null;
  to?: string | null;
}

interface ICampaign {
  name: string;
  campaignName?: string;
  [key: string]: any;
}

interface IInputRecord {
  name: string;
  value: string;
  [key: string]: any;
}

// ---------------------------------------------------------------------------
// Helpers (local utilities)
// ---------------------------------------------------------------------------

/**
 * Process filter info into an array consumable by the API.
 * Supports date-range objects (both array-wrapped and direct).
 */
function processFiltersWithDateRange<T extends Record<string, any>>(
  filterInfo?: T,
) {
  if (!filterInfo) return [];
  return Object.entries(filterInfo)
    .filter(([, value]) => {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        'from' in value[0]
      ) {
        const dateRange = value[0] as DateRangeValue;
        return (
          (dateRange.from !== null && dateRange.from !== undefined) ||
          (dateRange.to !== null && dateRange.to !== undefined)
        );
      }
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        'from' in value
      ) {
        const dateRange = value as DateRangeValue;
        return (
          (dateRange.from !== null && dateRange.from !== undefined) ||
          (dateRange.to !== null && dateRange.to !== undefined)
        );
      }
      return value !== null && value !== undefined;
    })
    .map(([key, value]) => {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        'from' in value[0]
      ) {
        return { key, value: value[0] };
      }
      return { key, value };
    });
}

/** Map raw lookup records to { label, value } options. */
function getOptions(records: IInputRecord[], childrenKey?: string) {
  return records?.map(({ name: value, value: label, ...rest }) => ({
    label,
    value,
    ...(childrenKey && {
      options: rest[childrenKey]?.map(
        ({ name, value, type }: { name: string; value: string; type: string }) => ({
          value: `${name}#${type}`,
          label: value,
        }),
      ),
    }),
  }));
}

// ---------------------------------------------------------------------------
// Campaign CRUD
// ---------------------------------------------------------------------------

/** Fetch paginated campaigns, optionally filtered. */
export async function fetchCampaigns(
  page: number,
  size: number,
  filterInfo?: Record<string, any>,
) {
  const filters = processFiltersWithDateRange(filterInfo);
  const hasFilters = filters.length > 0;

  if (hasFilters) {
    const { data } = await apiClient.post(
      `${BASE}/campaigns/filters`,
      { filters },
      { params: { page, size } },
    );
    data.data = data?.data?.map((campaign: ICampaign) => ({
      ...campaign,
      campaignName: campaign.name,
    }));
    return data;
  }

  const { data } = await apiClient.get(`${BASE}/campaigns`, {
    params: { page, size },
  });
  data.data = data?.data?.map((campaign: ICampaign) => ({
    ...campaign,
    campaignName: campaign.name,
  }));
  return data;
}

/** Fetch all campaigns (no pagination). */
export async function fetchAllCampaigns() {
  const { data } = await apiClient.get(`${BASE}/campaigns/all`);
  data.data = data?.data?.map((campaign: ICampaign) => ({
    ...campaign,
    campaignName: campaign.name,
  }));
  return data;
}

/** Fetch a single campaign by ID. */
export async function fetchCampaignDetails(
  campaignId: string,
  view = true,
) {
  const { data } = await apiClient.get(`${BASE}/campaigns/${campaignId}`);

  if (!view) return data;

  data.data = { ...data.data };
  return data;
}

/** Create a new campaign. */
export async function createCampaign(payload: Record<string, any>) {
  const { data } = await apiClient.post(`${BASE}/campaigns`, payload);
  return data;
}

/** Alias for createCampaign (POST). */
export async function postCreateCampaign(payload: Record<string, any>) {
  const { data } = await apiClient.post(`${BASE}/campaigns`, payload);
  return data;
}

/** Update an existing campaign. */
export async function putCreateCampaign(
  payload: Record<string, any>,
  campaignId: string,
) {
  const { data } = await apiClient.put(
    `${BASE}/campaigns/${campaignId}`,
    payload,
  );
  return data;
}

/** Clone an existing campaign. */
export async function cloneCampaign(campaignId: string) {
  const { data } = await apiClient.post(
    `${BASE}/campaigns/${campaignId}/clone`,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Campaign Statuses
// ---------------------------------------------------------------------------

/** Fetch campaign status options for filters / dropdowns. */
export async function fetchCampaignStatuses() {
  const { data } = await apiClient.get(`${BASE}/campaigns/statuses`);
  return data?.data?.map((status: { value: string; name: string }) => ({
    text: status.value,
    value: status.name,
  }));
}

// ---------------------------------------------------------------------------
// Collaborators
// ---------------------------------------------------------------------------

/** Update collaborators on a campaign. */
export async function updateCampaignCollaborators(
  payload: Record<string, string[]>,
  campaignId: string,
) {
  const { data } = await apiClient.put(
    `${BASE}/campaigns/${campaignId}/update-collaborators`,
    payload,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validate whether a campaign is editable. */
export async function validateCampaign(campaignId: string) {
  const { data } = await apiClient.get(
    `${BASE}/campaigns/${campaignId}/editable`,
  );
  return data;
}

/** Validate whether a line item can be created under the campaign. */
export async function validateCreateLineItemsAction(campaignId: string) {
  const { data } = await apiClient.get(
    `${BASE}/campaigns/${campaignId}/line-items/createable`,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Line Items
// ---------------------------------------------------------------------------

/** Create a new line item. */
export async function createLineItem(payload: Record<string, any>) {
  const { data } = await apiClient.post(`${BASE}/line-items`, payload);
  return data;
}

// ---------------------------------------------------------------------------
// IO File Upload / Download
// ---------------------------------------------------------------------------

/** Upload an IO file (multipart/form-data). */
export async function uploadIoFile(formData: FormData) {
  const { data } = await apiClient.post(
    `${ApiHost.FileService}/file/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** Download an IO file for a campaign. Returns the raw response (arraybuffer + headers). */
export async function downloadIOFile(
  campaignId: string,
  fileId: string,
): Promise<{ data: any; headers: Record<string, any> }> {
  const response = await apiClient.get(
    `${BASE}/campaigns/${campaignId}/download-io-file`,
    {
      params: { fileId },
      responseType: 'arraybuffer',
    },
  );
  return { data: response.data, headers: response.headers as Record<string, any> };
}

// ---------------------------------------------------------------------------
// Steps Prefilled Lists / Lookups
// ---------------------------------------------------------------------------

/** Fetch steps prefilled lists by lookup key. */
export async function fetchStepsPrefilledSteps(lookupKey: string) {
  const { data } = await apiClient.get(
    `${BASE}/campaigns/steps-prefilled-lists`,
    { params: { lookupKey } },
  );
  return data;
}

/** Assemble all prefilled lists needed for campaign forms. */
export async function prefilledLists(userId?: string) {
  const lists: Record<string, any[]> = {} as Record<string, any[]>;

  const orgResponse = await fetchOrganizationsByType('Marketer', userId);
  const marketerList =
    orgResponse?.data?.map(({ id, name: label, code }: any) => ({
      label,
      value: code,
      tenantCode: code,
      id,
    })) || [];
  lists[OptionsKeys.Marketers] = marketerList;

  const goalsResponse = await fetchStepsPrefilledSteps('goals');
  lists[OptionsKeys.CampaignGoals] = getOptions(
    goalsResponse?.data?.campaignGoals,
  );

  const step4Response = await fetchStepsPrefilledSteps('delivery');
  lists[OptionsKeys.InvoicingTerm] = getOptions(
    step4Response?.data?.invoicingTerm,
  );
  lists[OptionsKeys.PaymentTerm] = getOptions(
    step4Response?.data?.paymentTerm,
  );
  lists[OptionsKeys.DeliveryMethod] = getOptions(
    step4Response?.data?.deliveryMethod,
  );
  lists[OptionsKeys.DeliveryDays] = getOptions(
    step4Response?.data?.deliveryDays,
  );

  return lists;
}
