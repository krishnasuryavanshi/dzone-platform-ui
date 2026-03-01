import { apiClient } from '@dzone/shared-auth';
import { ApiHost, ApiResources } from '@dzone/shared-lib';

const BASE = ApiHost.PlatformService;

/** Fetch all lead validation settings with pagination. */
export async function fetchAllLeadValidationSettings(page: number, size: number) {
  const { data } = await apiClient.get(`${BASE}/settings`, { params: { page, size } });
  return data;
}

/** Fetch rules configuration metadata. */
export async function fetchLeadValidationSettingMetadata() {
  const { data } = await apiClient.get(`${BASE}/settings/metadata`);
  return data;
}

/** Fetch marketer settings list. */
export async function fetchMarketersLeadValidationSettings(tenantCode: string) {
  const { data } = await apiClient.get(`${BASE}/orgs/${tenantCode}/settings`);
  return data;
}

/** Create a marketer setting. */
export async function createLeadValidationSetting(
  tenantCode: string,
  requestData: Record<string, any>,
) {
  const { data } = await apiClient.post(
    `${BASE}/orgs/${tenantCode}/settings`,
    requestData,
  );
  return data;
}

/** Fetch a specific marketer setting. */
export async function fetchMarketersLeadValidationSetting(
  tenantCode: string,
  leadValidationSettingId: string,
) {
  const { data } = await apiClient.get(
    `${BASE}/orgs/${tenantCode}/settings/${leadValidationSettingId}`,
  );
  return data;
}

/** Update a marketer setting. */
export async function updateMarketersLeadValidationSetting(
  tenantCode: string,
  leadValidationSettingId: string,
  requestData: Record<string, any>,
) {
  const { data } = await apiClient.put(
    `${BASE}/orgs/${tenantCode}/settings/${leadValidationSettingId}`,
    requestData,
  );
  return data;
}

/** Fetch a line item setting. */
export async function fetchLineItemsLeadValidationSetting(
  lineItemId: string,
  leadValidationSettingId: string,
) {
  const { data } = await apiClient.get(
    `${BASE}/line-items/${lineItemId}/settings/${leadValidationSettingId}`,
  );
  return data;
}

/** Update a line item setting. */
export async function updateLineItemsLeadValidationSetting(
  lineItemId: string,
  leadValidationSettingId: string,
  requestData: Record<string, any>,
) {
  const { data } = await apiClient.put(
    `${BASE}/line-items/${lineItemId}/settings/${leadValidationSettingId}`,
    requestData,
  );
  return data;
}

/** Update a line item setting rule. */
export async function updateLineItemsLeadValidationSettingRule(
  lineItemId: string,
  leadValidationSettingId: string,
  ruleName: string,
  requestData: Record<string, any>,
) {
  const { data } = await apiClient.patch(
    `${BASE}/line-items/${lineItemId}/settings/${leadValidationSettingId}/rules/${ruleName}`,
    requestData,
  );
  return data;
}

/** Update a line item setting attribute. */
export async function updateLineItemsLeadValidationSettingAttribute(
  lineItemId: string,
  leadValidationSettingId: string,
  attributeId: string,
  requestData: Record<string, any>,
) {
  const { data } = await apiClient.put(
    `${BASE}/line-items/${lineItemId}/settings/${leadValidationSettingId}/attribute/${attributeId}`,
    requestData,
  );
  return data;
}

/** Fetch file upload metadata for a given file type. */
export async function fetchFileUploadMetadata(fileTypeName: string) {
  const { data } = await apiClient.get(
    `${ApiHost.FileService}/${ApiResources.FileUploadMetadata}`,
    { params: { fileTypeName } },
  );
  return data;
}

/** Upload files via multipart form data. */
export async function uploadFile(formData: FormData) {
  const { data } = await apiClient.post(
    `${ApiHost.FileService}/${ApiResources.LineItemMultipleFileUploads}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** Download a file by its id. */
export async function fileDownload(fileId: string) {
  const response = await apiClient.get(
    `${ApiHost.FileService}/${ApiResources.FileDownload.replace('{fileId}', fileId)}`,
    { responseType: 'blob' },
  );
  return response.data;
}
