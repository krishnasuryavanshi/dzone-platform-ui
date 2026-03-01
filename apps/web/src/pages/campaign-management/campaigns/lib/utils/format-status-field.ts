import { LineItemStatus } from '../../../line-items/lib/enums';

export const formatStatusField = (value: string | null | undefined) => {
  return LineItemStatus[value as keyof typeof LineItemStatus] || value || '\u2014';
};
