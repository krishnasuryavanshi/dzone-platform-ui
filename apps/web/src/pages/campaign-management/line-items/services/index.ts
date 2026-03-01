import { apiClient } from '@dzone/shared-auth';
import { ApiHost, ApiResources, OptionsKeys } from '@dzone/shared-lib';

import {
  DownloadLineItemFilesType,
  JobTitleTokenType,
  LineItemFileUploadTypes,
  LineItemPicklistMappings,
  LineItemSteps,
} from '../lib/enums';
import type { ILineItem, IPacingRequestData, ITransformAndExportLeads } from '../lib/types';
import { fetchOrganizationsByType } from '../../../admin/organizations/services';

// ---------------------------------------------------------------------------
// Base URLs
// ---------------------------------------------------------------------------

const CAMPAIGN = ApiHost.CampaignService;
const FILE = ApiHost.FileService;
const PLATFORM = ApiHost.PlatformService;
const RECOMMENDATION = ApiHost.RecommendationService;
const TRANSFORMATION = ApiHost.TransformationService;
const DELIVERY = ApiHost.CampaignDeliveryService;
const AUDIT = ApiHost.AuditService;

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

interface DateRangeValue {
  from?: string | null;
  to?: string | null;
}

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

function getOptions(records: any[], childrenKey?: string) {
  return records?.map(({ name: value, value: label, ...rest }: any) => ({
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

/**
 * Converts a UTC time string to local timezone.
 * @param utcTime - Time in format "2:45 PM" in UTC
 * @returns Time string in local timezone format "h:mm A"
 */
function convertUTCTimeToLocal(utcTime: string | null): string | null {
  if (!utcTime) return null;
  try {
    const [time, period] = utcTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 = hours + 12;
    else if (period === 'AM' && hours === 12) hour24 = 0;

    const utcDate = new Date();
    utcDate.setUTCHours(hour24, minutes, 0, 0);

    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTimeString = utcDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: localTimezone,
    });
    return localTimeString.replace(/\s+/g, ' ').toUpperCase();
  } catch {
    return utcTime;
  }
}

// ===========================================================================
// 1. LINE ITEM CRUD
// ===========================================================================

/** Fetch paginated line items, optionally filtered. */
export async function fetchLineItems(
  page: number,
  size: number,
  campaignId?: string,
  filterInfo: Record<string, any> = {},
) {
  const filters = processFiltersWithDateRange(filterInfo);
  const hasFilters = filters.length > 0;

  if (hasFilters) {
    const { data } = await apiClient.post(
      `${CAMPAIGN}/${ApiResources.FilteredLineitems}`,
      { filters },
      { params: { page, size, campaignId } },
    );
    data.data = data?.data?.map((lineItem: ILineItem) => ({
      ...lineItem,
      campaignName: lineItem.campaign?.name,
      pacing: lineItem?.pacing?.name,
    }));
    return data;
  }

  const params: Record<string, any> = { page, size };
  if (campaignId) params.campaignId = campaignId;

  const resource = campaignId
    ? `${ApiResources.LineItemsByCampaignId}/${campaignId}`
    : ApiResources.LineItems;

  const { data } = await apiClient.get(`${CAMPAIGN}/${resource}`, { params: { page, size } });
  data.data = data?.data?.map((lineItem: ILineItem) => ({
    ...lineItem,
    campaignName: lineItem.campaign?.name,
    pacing: lineItem?.pacing?.name,
  }));
  return data;
}

/** Fetch a single line item by ID. */
export async function fetchLineItem(lineItemId?: string) {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LineItems}/${lineItemId}`,
  );
  if (data?.data) {
    data.data = {
      ...data.data,
      jobTitles: data.data?.jobTitles?.length
        ? data.data.jobTitles.split(', ').map((jt: string) => ({
            text: jt,
            type: JobTitleTokenType.UserEntered,
          }))
        : null,
      campaignId: data.data.campaign?.campaignId,
    };
  }
  return data;
}

/** Create a new line item. */
export async function createLineItem(payload: Record<string, any>) {
  const { data } = await apiClient.post(
    `${CAMPAIGN}/${ApiResources.LineItems}`,
    payload,
  );
  return data;
}

/** Update an existing line item. */
export async function updateLineItem(
  payload: Record<string, any>,
  lineItemId: string,
) {
  const { data } = await apiClient.put(
    `${CAMPAIGN}/${ApiResources.LineItems}/${lineItemId}`,
    payload,
  );
  return data;
}

/** Clone a line item. */
export async function cloneLineItem(
  lineItemId: string,
  payload: Record<string, any>,
) {
  const { data } = await apiClient.post(
    `${CAMPAIGN}/${ApiResources.LineItems}/${lineItemId}/clone`,
    payload,
  );
  return data;
}

/** Validate whether a line item is editable. */
export async function validateLineItem(lineItemId: string) {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LineItems}/${lineItemId}/editable`,
  );
  return data;
}

/** Fetch line item status options. */
export async function fetchLineItemStatuses() {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LineItemStatusLookup}`,
  );
  return data?.data?.map((status: { value: string; name: string }) => ({
    text: status.value,
    value: status.name,
  }));
}

/** Update a line item's status. */
export async function updateLineItemStatus(
  lineItemId: string,
  payload: Record<string, any>,
) {
  const { data } = await apiClient.post(
    `${CAMPAIGN}/${ApiResources.LineItems}/${lineItemId}/status`,
    payload,
  );
  return data;
}

/** Update collaborators on a line item. */
export async function updateLineItemCollaborators(
  payload: Record<string, string[]>,
  lineItemId: string,
) {
  const { data } = await apiClient.put(
    `${CAMPAIGN}/${ApiResources.LineItems}/${lineItemId}/assign-collaborator`,
    payload,
  );
  return data;
}

/** Update custom fields on a line item. */
export async function updateLineItemCustomFields(
  lineItemId: string,
  payload: Record<string, any>,
) {
  const { data } = await apiClient.put(
    `${PLATFORM}/${ApiResources.LineItems}/${lineItemId}/custom-fields`,
    payload,
  );
  return data;
}

/** Fetch line item history (audit trail). */
export async function fetchLineItemHistory(
  lineItemId: string,
  params: { page: number; size: number; entityName: string },
) {
  const { entityName, ...queryParams } = params;
  const { data } = await apiClient.get(
    `${AUDIT}/histories/${entityName}/${lineItemId}`,
    { params: queryParams },
  );
  return { data };
}

// ===========================================================================
// 2. CAMPAIGNS LOOKUPS
// ===========================================================================

/** Fetch active campaigns list for dropdowns. */
export async function fetchActiveCampaignPicklist() {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.ActiveCampaignsList}`,
  );
  return data;
}

/** Fetch campaigns filtered by marketer tenant code. */
export async function fetchCampaignsByMarketer(tenantCode: string) {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.FilterCampaignsByMarketer}`,
    { params: { tenantCode } },
  );
  return data?.data;
}

/** Fetch the status picklist for line items. */
export async function fetchStatusPicklist() {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LineItemStatusLookup}`,
  );
  return { data };
}

// ===========================================================================
// 3. FORM PICKLISTS & PREFILLED LISTS
// ===========================================================================

/** Fetch line item picklist options by category. */
export async function fetchLineItemFormPicklists(
  category: LineItemPicklistMappings,
) {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.Lookups}`,
    { params: { source: category } },
  );
  return data;
}

/** Fetch custom question set number. */
export async function fetchLineItemFormCustomQuestionSetNumber() {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LineItemsCustomQuestionSetNumbers}`,
  );
  return data;
}

/** Fetch file upload metadata by type. */
export async function fetchLineItemFormFileUploadMeta(
  type: LineItemFileUploadTypes,
) {
  const metadataResources: Record<string, string> = {
    [LineItemFileUploadTypes.DeliveryTemplate]: ApiResources.LineItemDeliveryTemplateUploadMetaData,
    [LineItemFileUploadTypes.TargetAccountsList]: ApiResources.LineItemTALUploadMetaData,
    [LineItemFileUploadTypes.SuppressionsList]: ApiResources.LineItemSuppressionMetaData,
    [LineItemFileUploadTypes.JobTitlesList]: ApiResources.LineItemJobTitleFileMetaData,
    [LineItemFileUploadTypes.IntentKeywordsList]: ApiResources.LineItemInteKeywordFileMetaData,
    [LineItemFileUploadTypes.TechnologiesList]: ApiResources.LineItemTEchnologyFileMetaData,
  };
  const resource = metadataResources[type];
  const { data } = await apiClient.get(`${CAMPAIGN}/${resource}`, {
    params: { type },
  });
  return data;
}

/** Helper: Fetch list items from a given picklist type. */
async function fetchListByPicklistType(
  picklistType: LineItemPicklistMappings,
  childrenKey?: string,
): Promise<any> {
  const response = await fetchLineItemFormPicklists(picklistType);
  return getOptions(response?.data, childrenKey);
}

/** Fetch prefilled lists for a given line item step. */
export async function fetchPrefilledListsByStep(
  step: LineItemSteps,
  userId?: string,
) {
  const lists: Record<string, any[]> = {} as Record<string, any[]>;

  switch (step) {
    case LineItemSteps.BasicDetails: {
      const orgResponse = await fetchOrganizationsByType('Marketer', userId);
      lists[OptionsKeys.Marketers] =
        orgResponse?.data?.map(({ id, name: label, code }: any) => ({
          label,
          value: code,
          tenantCode: code,
          id,
        })) || [];
      break;
    }
    case LineItemSteps.Goals: {
      lists[OptionsKeys.Products] = await fetchListByPicklistType(
        LineItemPicklistMappings.Products,
      );
      break;
    }
    case LineItemSteps.DeliveryAndPacing: {
      lists[OptionsKeys.DeliveryDays] = await fetchListByPicklistType(
        LineItemPicklistMappings.DeliveryDays,
      );
      lists[OptionsKeys.DeliveryMethod] = await fetchListByPicklistType(
        LineItemPicklistMappings.DeliveryMethods,
      );
      lists[OptionsKeys.Pacing] = await fetchListByPicklistType(
        LineItemPicklistMappings.Pacing,
      );
      break;
    }
    case LineItemSteps.Targeting: {
      lists[OptionsKeys.JobFunctions] = await fetchListByPicklistType(
        LineItemPicklistMappings.JobFunctions,
      );
      lists[OptionsKeys.JobLevels] = await fetchListByPicklistType(
        LineItemPicklistMappings.JobLevels,
      );
      lists[OptionsKeys.CompanySizesEmployeeCount] =
        await fetchListByPicklistType(
          LineItemPicklistMappings.CompanySizesByEmployeeCount,
        );
      lists[OptionsKeys.CompanySizesRevenue] = await fetchListByPicklistType(
        LineItemPicklistMappings.CompanySizesByRevenue,
      );
      lists[OptionsKeys.Industries] = await fetchListByPicklistType(
        LineItemPicklistMappings.Industries,
        'industries',
      );
      lists[OptionsKeys.GeographyByCountry] = await fetchListByPicklistType(
        LineItemPicklistMappings.Countries,
      );
      lists[OptionsKeys.GeographyByRegion] = await fetchListByPicklistType(
        LineItemPicklistMappings.Regions,
      );
      break;
    }
  }
  return lists;
}

/** Fetch prefilled lists for basic details (Marketers + products + delivery). */
export async function fetchPrefilledListsBasicDetails(userId?: string) {
  const lists: Record<string, any[]> = {} as Record<string, any[]>;

  const orgResponse = await fetchOrganizationsByType('Marketer', userId);
  lists[OptionsKeys.Marketers] =
    orgResponse?.data?.map(({ id, name: label, code }: any) => ({
      label,
      value: code,
      tenantCode: code,
      id,
    })) || [];
  lists[OptionsKeys.Products] = await fetchListByPicklistType(
    LineItemPicklistMappings.Products,
  );
  lists[OptionsKeys.DeliveryDays] = await fetchListByPicklistType(
    LineItemPicklistMappings.DeliveryDays,
  );
  lists[OptionsKeys.DeliveryMethod] = await fetchListByPicklistType(
    LineItemPicklistMappings.DeliveryMethods,
  );
  lists[OptionsKeys.Pacing] = await fetchListByPicklistType(
    LineItemPicklistMappings.Pacing,
  );
  return lists;
}

/** Fetch employee count custom range max value. */
export async function maxEmployeeCustomRange() {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LineItemEmployeeCustomRange}`,
  );
  return { data: data?.data };
}

// ===========================================================================
// 4. FILE OPERATIONS
// ===========================================================================

/** Upload a file (generic — leads upload). */
export async function uploadFile(formData: FormData) {
  const { data } = await apiClient.post(
    `${PLATFORM}/${ApiResources.UploadFile}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** Upload a single file to the file service. */
export async function uploadSingleFile(formData: FormData) {
  const { data } = await apiClient.post(
    `${FILE}/${ApiResources.LineItemSingleFileUpload}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** Upload multiple files to the file service. */
export async function uploadMultipleFiles(formData: FormData) {
  const { data } = await apiClient.post(
    `${FILE}/${ApiResources.LineItemMultipleFileUploads}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** Upload a line-item-form-specific file (per type). */
export async function fetchLineItemFormFileUpload(formData: FormData) {
  const uploadResources: Record<string, string> = {
    [LineItemFileUploadTypes.DeliveryTemplate]: ApiResources.LineItemDeliveryTemplateUpload,
    [LineItemFileUploadTypes.TargetAccountsList]: ApiResources.LineItemTALFileUpload,
    [LineItemFileUploadTypes.SuppressionsList]: ApiResources.LineItemSupressionFileUpload,
    [LineItemFileUploadTypes.JobTitlesList]: ApiResources.LineItemJobTitleListFielUpload,
    [LineItemFileUploadTypes.IntentKeywordsList]: ApiResources.LineItemIntentKeyworkdFileUpload,
    [LineItemFileUploadTypes.TechnologiesList]: ApiResources.LineItemTechnologyFileUpload,
  };

  const type = formData.get('type') as string;
  const resource = uploadResources[type];
  if (!resource) {
    // Fallback to generic single file upload
    const { data } = await apiClient.post(
      `${FILE}/${ApiResources.LineItemSingleFileUpload}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data;
  }

  const { data } = await apiClient.post(
    `${CAMPAIGN}/${resource}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** Fetch file upload metadata (file types). */
export async function fetchFileUploadMeta() {
  const { data } = await apiClient.get(
    `${FILE}/${ApiResources.FileUploadMetadata}`,
  );
  return data;
}

/** Fetch file metadata by file type name. */
export async function fetchFileMetadata(fileTypeName: string) {
  const { data } = await apiClient.get(
    `${FILE}/${ApiResources.LineItemsFileUploadMetaData}`,
    { params: { fileTypeName } },
  );
  return data;
}

/** Fetch details for a single file. */
export async function fetchFileDetails(fileId: string) {
  const { data } = await apiClient.get(
    `${FILE}/${ApiResources.FileDetails}`,
    { params: { fileId } },
  );
  return data?.data;
}

/** Fetch details for multiple files. */
export async function fetchMultipleFileDetails(fileIds: string[]) {
  const { data } = await apiClient.post(
    `${FILE}/${ApiResources.MultipleFileDetails}`,
    { fileIds },
  );
  return data;
}

/** Download a line item file by type and fileId. */
export async function downloadLineItemFiles(
  lineItemId: string,
  fileData: { fileType: string; fileId: string },
): Promise<{ data: any; headers: Record<string, any> }> {
  const downloadResources: Record<string, string> = {
    [DownloadLineItemFilesType.DownloadDeliveryTemplateFile]:
      ApiResources.DownloadDeliveryTemplateFile,
    [DownloadLineItemFilesType.DownloadIntentKeywordsFile]:
      ApiResources.DownloadIntentKeywordsFile,
    [DownloadLineItemFilesType.DownloadJobTitleListFile]:
      ApiResources.DownloadJobTitleListFile,
    [DownloadLineItemFilesType.DownloadSuppressionFile]:
      ApiResources.DownloadSuppressionFile,
    [DownloadLineItemFilesType.DownloadTALFile]: ApiResources.DownloadTALFile,
    [DownloadLineItemFilesType.DownloadTechnologyFile]:
      ApiResources.DownloadTechnologyFile,
  };

  const { fileType, fileId } = fileData;
  const resource = downloadResources[fileType];
  const response = await apiClient.get(
    `${CAMPAIGN}/${resource}/${lineItemId}`,
    {
      params: { fileId },
      responseType: 'arraybuffer',
    },
  );
  return { data: response.data, headers: response.headers as Record<string, any> };
}

/** Download a file by its ID (returns URL for browser download). */
export async function fileDownload(fileId: string) {
  const { data } = await apiClient.get(
    `${FILE}/${ApiResources.FileDownload.replace('{fileId}', fileId)}`,
  );
  if (data?.data?.url) {
    const link = document.createElement('a');
    link.href = data.data.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return data;
}

/** Download the lead upload template. */
export async function downloadLeadUploadTemplate(
  lineItemId: string,
  validationSettingId: string,
  tenantCode: string,
): Promise<{ data: any; headers: Record<string, any> }> {
  const response = await apiClient.get(
    `${FILE}/${ApiResources.DownloadLeadUploadTemplate}`,
    {
      params: { lineItemId, validationSettingId, tenantCode },
      responseType: 'arraybuffer',
    },
  );
  return { data: response.data, headers: response.headers as Record<string, any> };
}

// ===========================================================================
// 5. LEAD OPERATIONS
// ===========================================================================

/** Publish leads for a line item. */
export async function publishLeads(data: {
  lineItemId: string;
  leadIds: number[];
}) {
  const { lineItemId, leadIds } = data;
  const response = await apiClient.post(
    `${PLATFORM}/${ApiResources.PublishLeads.replace('{lineItemId}', lineItemId)}`,
    { leadIds },
  );
  return response.data;
}

/** Return leads for a line item. */
export async function returnLeads(
  lineItemId: string,
  leadIds: number[],
  returnReasons: string[],
) {
  const { data } = await apiClient.post(
    `${PLATFORM}/${ApiResources.ReturnLeads.replace('{lineItemId}', lineItemId)}`,
    { ids: leadIds, returnReasons },
  );
  return data;
}

/** Bulk update lead statuses. */
export async function leadsStatusUpdate(
  leadUpdates: Array<{ leadStatus: string; id: number }>,
  tenantCode?: string,
) {
  const { data } = await apiClient.put(
    `${PLATFORM}/${ApiResources.UpdateLeadsStatus}`,
    leadUpdates,
    { headers: { tenantCode: tenantCode || '' } },
  );
  return data;
}

/** Update details for a single lead. */
export async function updateLeadDetails(
  id: number,
  leadData: Record<string, any>,
  tenantCode?: string,
) {
  const { data } = await apiClient.put(
    `${PLATFORM}/${ApiResources.LeadDetailsById.replace('{id}', String(id))}`,
    { ...leadData },
    { headers: { tenantCode: tenantCode || '' } },
  );
  return data;
}

/** Fetch the review leads list for a line item. */
export async function fetchReviewLeadsList(
  lineItemId: string,
  filters: Record<string, any>[] = [],
) {
  const { data } = await apiClient.post(
    `${PLATFORM}/${ApiResources.LeadsDetails}`,
    { lineItemId, filters },
  );
  return data;
}

/** Fetch lead details by tracking ID / lead ID. */
export async function fetchLeadDetailsById(
  id: number,
  tenantCode?: string,
) {
  const { data } = await apiClient.get(
    `${PLATFORM}/${ApiResources.LeadDetailsById.replace('{id}', String(id))}`,
    { headers: { tenantCode: tenantCode || '' } },
  );
  return data?.data;
}

/** Fetch lead review form config. */
export async function fetchLeadReviewFormConfig(
  type: string,
  lineItemId?: string,
) {
  const params: Record<string, string> = { type };
  if (lineItemId) params.lineItemId = lineItemId;

  const { data } = await apiClient.get(
    `${PLATFORM}/${ApiResources.LeadReviewFormConfig}`,
    { params },
  );
  return data;
}

/** Fetch lead validation history. */
export async function fetchLeadValidationHistory(
  lineItemId: string,
  trackingId: string,
  id: number,
) {
  const { data } = await apiClient.get(
    `${CAMPAIGN}/${ApiResources.LeadValidationHistory.replace('{lineItemId}', lineItemId)}`,
    { params: { trackingId, id } },
  );
  return data;
}

/** Fetch total leads count for a line item. */
export async function fetchTotalLeadsCount(lineItemId: string) {
  const { data } = await apiClient.get(
    `${PLATFORM}/${ApiResources.TotalLeadsCount.replace('{lineItemId}', lineItemId)}`,
  );
  return data?.data;
}

/** Fetch total filtered leads count for a line item. */
export async function fetchTotalFilteredLeadsCount(
  lineItemId: string,
  filters: Record<string, any>[] = [],
) {
  const { data } = await apiClient.post(
    `${CAMPAIGN}/${ApiResources.TotalFilteredLeadsCount.replace('{lineItemId}', lineItemId)}`,
    { filters },
  );
  return data?.data;
}

/** Fetch lead upload processing / validation status. */
export async function fetchLeadUploadProcessingStatus(
  lineItemId: string,
  requestId?: string,
) {
  const params: Record<string, string> = {};
  if (requestId) params.batchId = requestId;

  const { data } = await apiClient.get(
    `${PLATFORM}/${ApiResources.LeadUploadValidationCount.replace('{lineItemId}', lineItemId)}`,
    { params },
  );
  return data;
}

/** Check the status of a lead upsert task. */
export async function checkLeadUpsertTaskStatus(requestId: string) {
  const { data } = await apiClient.get(
    `${PLATFORM}/${ApiResources.LeadUpsertTaskStatus.replace('{requestId}', requestId)}`,
  );
  return data;
}

// ===========================================================================
// 6. DELIVERY SCHEDULES & TEMPLATES
// ===========================================================================

/** Delivery schedule types. */
export interface DeliverySchedule {
  id: string;
  lineItemId: string;
  deliveryType: string;
  deliveryFormat: 'CSV' | 'Excel' | null;
  deliveryTemplateId: string;
  deliveryTemplate: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime';
  deliveryDay: number | null;
  deliveryDate: number | null;
  deliveryTime: string | null;
  time: string | null;
  nextDelivery: string | null;
  leadCount: number;
  lastActivity: string;
  status: 'Active' | 'Paused' | 'Cancelled';
}

export interface DeliverySchedulesResponse {
  data: DeliverySchedule[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface CreateDeliverySchedulePayload {
  lineItemId: string;
  deliveryType: string;
  deliveryFormat: 'CSV' | 'Excel' | null;
  deliveryTemplateId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime';
  deliveryDay: number | null;
  deliveryDate: number | null;
  deliveryTime: string | null;
}

export type UpdateDeliverySchedulePayload =
  | Partial<CreateDeliverySchedulePayload>
  | { status: 'Active' | 'Paused' | 'Cancelled' };

/** Fetch delivery schedules for a line item. */
export async function fetchDeliverySchedules(
  lineItemId?: string,
): Promise<DeliverySchedulesResponse | null> {
  try {
    const resource = lineItemId
      ? `${ApiResources.LineItemDeliverySchedulesList.replace('{lineItemId}', lineItemId)}`
      : ApiResources.LineItemDeliverySchedules;

    const { data } = await apiClient.get(`${PLATFORM}/${resource}`);

    // Convert deliveryTime from UTC to local timezone
    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map((schedule: DeliverySchedule) => ({
        ...schedule,
        deliveryTime: convertUTCTimeToLocal(schedule.deliveryTime),
      }));
    }
    return data;
  } catch {
    return null;
  }
}

/** Create a new delivery schedule. */
export async function createDeliverySchedule(
  payload: CreateDeliverySchedulePayload,
): Promise<DeliverySchedule | null> {
  try {
    const { data } = await apiClient.post(
      `${PLATFORM}/${ApiResources.LineItemDeliverySchedules}`,
      payload,
    );
    return data;
  } catch {
    return null;
  }
}

/** Update an existing delivery schedule. */
export async function updateDeliverySchedule(
  id: string,
  payload: UpdateDeliverySchedulePayload,
): Promise<DeliverySchedule | null> {
  try {
    const { data } = await apiClient.put(
      `${PLATFORM}/${ApiResources.LineItemDeliveryScheduleById.replace('{scheduleId}', id)}`,
      payload,
    );
    return data;
  } catch {
    return null;
  }
}

/** Update a delivery schedule's status. */
export async function updateDeliveryScheduleStatus(
  id: string,
  status: 'Active' | 'Paused' | 'Cancelled',
): Promise<DeliverySchedule | null> {
  return updateDeliverySchedule(id, { status });
}

/** Delivery log types. */
export interface DeliveryLog {
  id: string;
  deliveryTemplateScheduleId: string;
  trackingId: string;
  status: 'SYNCED' | 'FAILED' | 'PENDING';
  message: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryLogsResponse {
  data: DeliveryLog[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface FetchDeliveryLogsParams {
  scheduleId: string;
  page?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

/** Fetch delivery logs for a schedule. */
export async function fetchDeliveryLogs(
  params: FetchDeliveryLogsParams,
): Promise<DeliveryLogsResponse | null> {
  try {
    const { scheduleId, ...queryParams } = params;
    const { data } = await apiClient.get(
      `${PLATFORM}/${ApiResources.LineItemDeliveryScheduleLogsById.replace('{scheduleId}', scheduleId)}`,
      { params: queryParams },
    );
    return data;
  } catch {
    return null;
  }
}

/** Delivery template type. */
export interface DeliveryTemplateType {
  deliveryType: string;
  deliveryFormat: string[] | null;
}

/** Fetch available delivery template types. */
export async function fetchDeliveryTemplateTypes(): Promise<{
  data: DeliveryTemplateType[];
  message: string;
} | null> {
  try {
    const { data } = await apiClient.get(
      `${PLATFORM}/${ApiResources.DeliveryTemplateTypes}`,
    );
    return data;
  } catch {
    return null;
  }
}

/** Delivery template. */
export interface DeliveryTemplate {
  id: string;
  name: string;
  integrationId?: string;
}

/** Fetch delivery templates by delivery type. */
export async function fetchDeliveryTemplateList(
  deliveryType: string,
): Promise<{ data: DeliveryTemplate[]; message: string } | null> {
  try {
    const { data } = await apiClient.get(
      `${DELIVERY}/${ApiResources.DeliveryTemplateByDeliveryType.replace('{deliveryType}', deliveryType)}`,
    );
    return data;
  } catch {
    return null;
  }
}

// ===========================================================================
// 7. PACING
// ===========================================================================

/** Generate pacing chart data. */
export async function generatePacingChart(payload: IPacingRequestData) {
  const { data } = await apiClient.post(
    `${CAMPAIGN}/${ApiResources.GeneratePacingChart}`,
    payload,
  );
  return data;
}

// ===========================================================================
// 8. RECOMMENDATIONS
// ===========================================================================

/** Fetch job title recommendations. */
export async function fetchRecommendations(type: string, value: string) {
  const { data } = await apiClient.post(
    `${RECOMMENDATION}/${ApiResources.JobTitleRecommendations}`,
    undefined,
    { params: { [type]: value } },
  );

  if (!data?.length) return null;

  return {
    name: value,
    children: data.map((job_title: string) => ({
      label: job_title,
      value: `${job_title}###${value}`,
    })),
  };
}

// ===========================================================================
// 9. VALIDATION TEMPLATES
// ===========================================================================

/** Fetch validation templates for an organization. */
export async function fetchValidationTemplates(orgCode: string) {
  const { data } = await apiClient.get(
    `${PLATFORM}/${ApiResources.ValidationTemplates.replace('{orgCode}', orgCode)}`,
  );
  return data;
}

// ===========================================================================
// 10. TRANSFORM & EXPORT
// ===========================================================================

/** Transformation history item type. */
export interface TransformationHistoryItem {
  id: string;
  file: { id: string; filename: string } | null;
  template: { id: string; name: string };
  status: 'PENDING' | 'PROCESSING' | 'FAILED' | 'ERROR' | 'SUCCESS';
  errorMessage: string | null;
}

export interface TransformationHistoryResponse {
  page: number;
  size: number;
  total: number;
  data: TransformationHistoryItem[];
}

/** Transform and export leads. */
export async function transformAndExportLeads(
  requestPayload: ITransformAndExportLeads,
): Promise<{ data?: any; headers?: Record<string, any>; isError?: boolean; error?: Record<string, any> }> {
  try {
    const response = await apiClient.post(
      `${TRANSFORMATION}/${ApiResources.TransformAndExportLeads}`,
      { ...requestPayload, outputType: 'csv' },
    );
    return { data: response.data, headers: response.headers as Record<string, any> };
  } catch (error: any) {
    const err = error?.response?.data?.error || error?.data?.error || {};
    const { message, messageHeader, statusCode } = err;
    if (statusCode === 400 || statusCode === 413) {
      return {
        isError: true,
        error: { statusCode, messageHeader, message },
      };
    }
    return {
      isError: true,
      error: { statusCode, message },
    };
  }
}

/** Fetch transformation history for a line item. */
export async function fetchTransformationHistory(
  lineItemId: string,
  page: number = 1,
  size: number = 10,
): Promise<TransformationHistoryResponse | null> {
  try {
    const { data } = await apiClient.get(
      `${TRANSFORMATION}/${ApiResources.TranformationHistory}`,
      { params: { lineItemId, page, size } },
    );
    return data?.data;
  } catch {
    return null;
  }
}

/** Fetch delivery templates by marketer code. */
export async function fetchDeliveryTemplatesByMarketer(
  marketerCode: string,
  lineItemId?: string,
) {
  try {
    const { data } = await apiClient.get(
      `${DELIVERY}/${ApiResources.DeliveryTemplatesByMarketer.replace('{marketerCode}', marketerCode)}`,
      { params: { lineItemId } },
    );
    return data;
  } catch {
    return null;
  }
}
