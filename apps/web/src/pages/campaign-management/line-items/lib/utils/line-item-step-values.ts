import { LineItemSteps } from '../enums';

export const LineItemStepValues = Object.values(LineItemSteps).filter(
    (value) => typeof value === 'number'
  ) as LineItemSteps[];
