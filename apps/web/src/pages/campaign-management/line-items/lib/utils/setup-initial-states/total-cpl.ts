import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';

export const setupTotalCplFieldInitialState = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const isValueAddLineItem = !!form.getFieldValue(
    LineItemFields.IsValueAddedLineItem,
  );

  updateTargetCostPerLeadField(
    isValueAddLineItem,
    patchFormValues,
    updateFormStepDetails,
  );
};

export const updateTargetCostPerLeadField = (
  isValueAddLineItem: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const props = {
    disabled: isValueAddLineItem,
    rules: [
      {
        pattern: /^\d*\.?\d*$/,
      },
    ],
  };
  if (isValueAddLineItem) {
    patchFormValues({
      [LineItemFields.TargetCostPerLead]: 0,
    });
  }

  updateFormStepDetails(
    LineItemSections.Goals,
    LineItemFields.TargetCostPerLead,
    props,
  );
};
