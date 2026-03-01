import { LineItemFields, LineItemSections } from '../../enums';
import { updateRevenueCustomRangeField } from '../setup-initial-states';

export const isRevenueCustomRange = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const onChange = (e: any) => {
    patchFormValues({
      [LineItemFields.IsCompanySizeRevenueCustom]: e.target.value,
    });

    updateRevenueCustomRangeField(
      e.target.value,
      patchFormValues,
      updateFormStepDetails,
    );
  };

  updateFormStepDetails(
    LineItemSections.CompanySizeRevenue,
    LineItemFields.IsCompanySizeRevenueCustom,
    { onChange },
  );
};
