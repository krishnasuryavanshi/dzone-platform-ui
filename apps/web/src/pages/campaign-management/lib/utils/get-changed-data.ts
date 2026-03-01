import isEqual from 'lodash-es/isEqual';
import { CampaignField } from '../../campaigns/lib/enums';
import { LineItemFields } from '../../line-items/lib/enums';
import { formatDate } from '@dzone/shared-lib';
import {
  UNCHANGING_KEYS,
  FILE_KEYS,
  dateKeys,
} from './keys-required-for-changed-data';

export const getChangedData = (
  currentData: Record<string, any>,
  previousData: Record<string, any>,
) => {
  const changedData: Record<string, any> = {};

  for (const key in currentData) {
    if (key in previousData) {
      if (UNCHANGING_KEYS.includes(key as CampaignField | LineItemFields)) {
        continue;
      }

      if (FILE_KEYS.includes(key as CampaignField | LineItemFields)) {
        if (!isEqual(currentData[key], previousData[key]?.id)) {
          changedData[key] = currentData[key];
        }
      } else if (isDateKey(key)) {
        const originalValue = previousData[key];
        const updatedValue = currentData[key];
        if (formatDate(originalValue) !== formatDate(updatedValue)) {
          changedData[key] = currentData[key];
        }
      } else if (
        typeof currentData[key] === 'object' &&
        typeof previousData[key] === 'object'
      ) {
        if (currentData[key]?.id && previousData[key]?.id) {
          if (currentData[key].id !== previousData[key].id) {
            changedData[key] = currentData[key];
          }
        } else if (!isEqual(currentData[key], previousData[key])) {
          changedData[key] = currentData[key];
        }
      } else if (!isEqual(currentData[key], previousData[key])) {
        changedData[key] = currentData[key];
      }
    } else {
      changedData[key] = currentData[key];
    }
  }

  return Object.fromEntries(Object.entries(changedData));
};

const isDateKey = (key: string): boolean => {
  return dateKeys.includes(key as CampaignField | LineItemFields);
};
