import { LineItemFields, LineItemSections } from '../../enums';
import { isIntegrateConvertrRequired } from './is-integrate-converter-required';

export const attachDeliveryMethodHandler = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const onChange = async (deliveryMethod: string) => {
    patchFormValues({
      [LineItemFields.DeliveryMethod]: deliveryMethod,
    });
    isIntegrateConvertrRequired(deliveryMethod, updateFormStepDetails);
  };

  updateFormStepDetails(
    LineItemSections.Delivery,
    LineItemFields.DeliveryMethod,
    { onChange },
  );
};
