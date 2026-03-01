import { notification } from 'antd';
import { uploadFile } from '../services';

/**
 * Validates file sizes and uploads valid files.
 */
export const fileSortAndUpload = async (
  fileObject: Record<string, any>,
  fileValidationMetadata: Record<string, any>,
  tenantCode: string,
  fileTypeName: string,
) => {
  const files = fileObject.fileList;
  const maxSizeBytes = parseMaxSizeBytes(fileValidationMetadata?.size);

  const [valid, invalid] = files.reduce(
    (acc: [File[], Record<string, any>[]], file: Record<string, any>) => {
      if (file.size <= maxSizeBytes) {
        acc[0].push(file.originFileObj);
      } else {
        acc[1].push(file);
      }
      return acc;
    },
    [[], []] as [File[], Record<string, any>[]],
  );

  if (invalid?.length) {
    const errorMessage = `Upload unsuccessful. One or more files exceeds the ${fileValidationMetadata?.size} size limit. Please choose smaller files.`;
    notification.error({ message: errorMessage });
    throw new Error(errorMessage);
  }

  let validFiles: Record<string, any>[] = [];

  if (valid.length) {
    const formData = new FormData();
    formData.append('tenantCode', tenantCode);
    formData.append('fileTypeName', fileTypeName);
    valid.forEach((file: File) => {
      formData.append('files', file);
    });

    const result = await uploadFile(formData);
    if (result?.data?.length) {
      validFiles = result.data;
    }
  }

  return validFiles;
};

/** Parse size string like "5MB" to bytes. */
function parseMaxSizeBytes(sizeStr?: string): number {
  if (!sizeStr) return Infinity;
  const match = sizeStr.match(/^(\d+)\s*(KB|MB|GB)$/i);
  if (!match) return Infinity;
  const num = parseInt(match[1], 10);
  const unit = match[2].toUpperCase();
  if (unit === 'KB') return num * 1024;
  if (unit === 'MB') return num * 1024 * 1024;
  if (unit === 'GB') return num * 1024 * 1024 * 1024;
  return Infinity;
}

/**
 * Determines the redirect URL based on lineItemId and redirectTo query parameter.
 */
export const getNavigationUrl = (
  lineItemId?: string | null,
  redirectTo?: string,
): string => {
  if (lineItemId) {
    if (redirectTo === 'view') {
      return `/campaign-management/line-items/${lineItemId}`;
    } else if (redirectTo === 'edit') {
      return `/campaign-management/line-items/${lineItemId}/edit`;
    }
    return `/campaign-management/line-items/${lineItemId}`;
  }
  return '/lead-validation-settings';
};

/**
 * Formats payload for creating/updating validation settings.
 */
export const formatPayload = (
  values: Record<string, any>,
  enabledRules: Record<string, boolean>,
  selectedValues: Record<string, any>,
  leadValidationSettingConfig: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = { ...values };
  const validations: Record<string, any> = {};

  const enabledRulesKeys = Object.keys(enabledRules).filter(
    (key) => enabledRules[key],
  );

  for (const rule of enabledRulesKeys) {
    const config = leadValidationSettingConfig[rule];
    if (!config) continue;
    const ruleSections: Record<string, any> = {};

    for (const section of config.sections || []) {
      const sectionName = section.name;
      const selectedSection = selectedValues[sectionName];
      if (!selectedSection) continue;

      if (rule === 'TARGETING') {
        if (sectionName === 'TARGETING' || sectionName === 'KEYWORD_LIST') {
          const arr: any[] = [];
          for (const key in selectedSection) {
            const val = selectedSection[key];
            if (val && typeof val === 'object' && val.type && val.data) {
              arr.push({
                name: key,
                type: val.type,
                value:
                  val.type === 'OPTIONS'
                    ? key === 'jobTitle'
                      ? val.data.map((item: any) => item.text)
                      : val.data
                    : val.data.map((item: any) => item.id),
              });
            }
          }
          if (arr.length) ruleSections[sectionName] = arr;
        }
        continue;
      }

      if (sectionName === 'LOOPBACK_PERIOD') {
        const arr: any[] = [];
        arr.push({
          name: section?.attributes[0]?.name,
          value: selectedSection[section?.attributes[0]?.name],
        });
        if (arr.length) ruleSections[sectionName] = arr;
        continue;
      }

      if (typeof selectedSection === 'object' && !Array.isArray(selectedSection)) {
        const arr: any[] = [];
        for (const key in selectedSection) {
          arr.push({ name: key, value: selectedSection[key] });
        }
        if (arr.length) ruleSections[sectionName] = arr;
      } else if (Array.isArray(selectedSection)) {
        ruleSections[sectionName] = selectedSection;
      } else {
        ruleSections[sectionName] = selectedSection;
      }
    }
    validations[rule] = { selected: true, sections: ruleSections };
  }

  result.rules = validations;
  return result;
};
