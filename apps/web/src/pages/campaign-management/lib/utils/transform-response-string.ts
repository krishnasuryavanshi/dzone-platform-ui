import { IPicklistItem } from '../types';

export const transformResponseString = (
  data: IPicklistItem,
  field?: string
): string => {
  const key = field ? 'value' : 'name';
  return data?.[key];
};
