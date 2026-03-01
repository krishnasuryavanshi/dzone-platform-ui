import {
  LineItemFields,
  SelectedDeliveryMethod,
  LineItemSections,
} from '../../enums';

export const isIntegrateConvertrRequired = (
  deliveryMethod: any,
  updateFormStepDetails: Function
) => {
  const isRequired = Object.values(SelectedDeliveryMethod).includes(
    deliveryMethod
  );
  updateFormStepDetails(
    LineItemSections.Delivery,
    LineItemFields.IntegrateConverterID,
    {
      rules: [{ required: isRequired }],
    }
  );
};
