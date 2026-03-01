import { pick } from 'lodash-es';
import { formatCampaignFormData } from './format-campaign-form-data';
import { formatLineItemFormData } from './format-line-item-form-data';

export enum StorageKey {
  CampaignForm = 'campaign-form',
  LineItemForm = 'line-item-form',
}

export enum StepsProgress {
  Processed = 'processed',
  InProgress = 'in-progress',
}

const getStorageData = (key: string): Record<string, any> => {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : { steps: {} };
  } catch {
    return { steps: {} };
  }
};

const setStorageData = (key: string, data: Record<string, any>) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const saveFormDataInCookies = async (
  data: Record<string, any>,
  storage: StorageKey,
  isDzoneUser?: boolean,
) => {
  saveInitialData(data, storage);
  const formData =
    storage === StorageKey.CampaignForm
      ? formatCampaignFormData(data)
      : formatLineItemFormData(data);
  saveStepwiseData(formData, storage, isDzoneUser);
  return true;
};

const saveInitialData = (data: Record<string, any>, storage: StorageKey) => {
  const initialData = { finishedStepId: data?.stepId - 1, id: data?.id };
  const existing = getStorageData(storage);
  setStorageData(storage, { ...existing, ...initialData });
};

const saveStepwiseData = (
  data: Record<string, any>,
  storage: StorageKey,
  _isDzoneUser?: boolean,
) => {
  // TODO: Import form configs from campaigns/config and line-items/config when available in 5B/5C
  const steps: Record<string, any[]> = {};
  const stepsKeys = Object.keys(steps);
  const storageData = getStorageData(storage);

  for (const step of stepsKeys) {
    if (Number(step) < data.stepId) {
      const stepKeys = getFieldKeys((steps as any)[step] as any[]);
      const stepData = { status: StepsProgress.Processed, fields: pick(data, stepKeys) };
      if (!storageData.steps) storageData.steps = {};
      storageData.steps[step] = stepData;
    } else {
      break;
    }
  }
  setStorageData(storage, storageData);
};

const getFieldKeys = (sections: any[]) => {
  return sections.flatMap((section) =>
    section.fields.map((field: Record<string, any>) => field.field),
  );
};
