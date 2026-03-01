import { dateObject } from '@dzone/shared-lib';
import { dateFields } from '../../../lib/constants';

const getInitialFormValues = (
  step: number,
  storageKey: string,
) => {
  try {
    const stored = sessionStorage.getItem(storageKey);
    const formData = stored ? JSON.parse(stored) : { steps: {} };
    return formData?.steps?.[step] || {};
  } catch {
    return {};
  }
};

export const setupInitialValues = (
  patchFormValues: (values: any) => void,
  step: number,
  storageKey: string,
) => {
  const { fields } = getInitialFormValues(step, storageKey);
  if (fields) {
    const formattedValues = { ...fields };

    for (const field of dateFields) {
      if (formattedValues[field]) {
        formattedValues[field] = dateObject(formattedValues[field]);
      }
    }
    patchFormValues(formattedValues);
  }
};
