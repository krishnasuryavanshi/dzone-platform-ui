import { LineItemStatus } from '../../../line-items/lib/enums';

export const Status = Object.entries(LineItemStatus).map(([value, label]) => ({
  label,
  value,
}));
