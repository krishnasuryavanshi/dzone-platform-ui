import { IPicklistItem } from '../types';

export const transformResponseObject = (data: IPicklistItem[] = []) => {
  return data && data.map((item) => item.name);
};
