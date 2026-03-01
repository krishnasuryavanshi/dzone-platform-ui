import { LineItemFields, LineItemSections, LineItemSteps } from '../enums';

export const LineItemDeliveryMethodMap = {
  [LineItemFields.DeliveryMethod]: {
    step: LineItemSteps.DeliveryAndPacing,
    section: LineItemSections.Delivery,
    field: LineItemFields.IntegrateConverterID,
    changeField: LineItemFields.DeliveryMethod,
  },
};
