import { useState } from 'react';

// fetchMultipleFileDetails, fetchValidationTemplates will be created in line-items/services in sub-phase 5C

export const useFileMetadata = (marketerCode?: string) => {
  const [fileMap, setFileMap] = useState<Record<string, any>>({});
  const [validationSettingMap, setValidationSettingMap] = useState<Record<string, string>>({});

  const isFileId = (value: string): boolean => /^[a-f0-9-]{36}$/.test(value);

  const extractFileIds = (value: any): string[] => {
    if (!value) return [];
    if (typeof value === 'object' && value !== null && 'value' in value) {
      if (Array.isArray(value.value)) {
        return value.value.filter((v: string) => typeof v === 'string' && isFileId(v));
      }
      return typeof value.value === 'string' && isFileId(value.value) ? [value.value] : [];
    }
    if (Array.isArray(value)) return value.flatMap(extractFileIds);
    if (typeof value === 'string') return isFileId(value) ? [value] : [];
    return [];
  };

  const fetchFileMetadata = async (diff: any[]) => {
    let allFileIds: string[] = [];

    for (const item of diff) {
      const isJobTitle = item.name?.toLowerCase().includes('jobtitle');
      if (item.type === 'File') {
        allFileIds.push(...extractFileIds(item.from), ...extractFileIds(item.to));
      }
      if (item.from && typeof item.from === 'object' && 'isInclusion' in item.from) {
        if (!isJobTitle || item.from.isInclusion) allFileIds.push(...extractFileIds(item.from));
      }
      if (item.to && typeof item.to === 'object' && 'isInclusion' in item.to) {
        if (!isJobTitle || item.to.isInclusion) allFileIds.push(...extractFileIds(item.to));
      }
      if (item.level && Array.isArray(item.level)) {
        for (const lvl of item.level) {
          const isNestedJobTitle = lvl.type?.toLowerCase().includes('jobtitle');
          if (lvl.from && typeof lvl.from === 'object' && 'isInclusion' in lvl.from) {
            if (!isNestedJobTitle || lvl.from.isInclusion) allFileIds.push(...extractFileIds(lvl.from));
          }
          if (lvl.to && typeof lvl.to === 'object' && 'isInclusion' in lvl.to) {
            if (!isNestedJobTitle || lvl.to.isInclusion) allFileIds.push(...extractFileIds(lvl.to));
          }
        }
      }
      if (item.name === 'lineItem.validationSettingsId') {
        const ids = [item.from, item.to].filter(Boolean);
        if (ids.length > 0 && marketerCode) {
          try {
            const { fetchValidationTemplates } = await import('../../../../line-items/services');
            const res = await fetchValidationTemplates(marketerCode);
            ids.forEach((id) => {
              const matched = res?.data?.find((tpl: any) => tpl.id === id);
              if (matched?.name) {
                setValidationSettingMap((prev) => ({ ...prev, [id]: matched.name }));
              }
            });
          } catch {
            // silently handle
          }
        }
      }
    }

    allFileIds = Array.from(new Set(allFileIds.filter(Boolean)));
    if (allFileIds.length > 0) {
      try {
        const { fetchMultipleFileDetails } = await import('../../../../line-items/services');
        const fileDetails = await fetchMultipleFileDetails(allFileIds);
        const map: Record<string, any> = {};
        fileDetails?.data?.forEach((file: any) => {
          if (file.id) map[file.id] = file;
        });
        setFileMap((prev) => ({ ...prev, ...map }));
      } catch {
        // silently handle
      }
    }
  };

  return { fileMap, validationSettingMap, fetchFileMetadata };
};
