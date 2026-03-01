import { LineItemFields, LineItemSections } from '../../enums';
import { updateTargetCostPerLeadField } from '../setup-initial-states';

export const attachIsValueAddLineItemHandler = (
  patchFormValues: Function,
  updateFormStepDetails: Function
) => {
  const onChange = (e: any) => {
    patchFormValues({
      [LineItemFields.IsValueAddedLineItem]: e.target.checked,
    });

    updateTargetCostPerLeadField(
      e.target.checked,
      patchFormValues,
      updateFormStepDetails
    );
  };

  updateFormStepDetails(
    LineItemSections.Goals,
    LineItemFields.IsValueAddedLineItem,
    { onChange }
  );
};
