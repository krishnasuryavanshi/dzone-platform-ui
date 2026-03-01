import { LineItemFields, LineItemSections } from '../../enums';
import { updateCountCustomRangeField } from '../setup-initial-states';

export const isCountCustomRange = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const onChange = (e: any) => {
    patchFormValues({
      [LineItemFields.IsCompanySizeEmployeeCountCustom]: e.target.value,
    });

    updateCountCustomRangeField(
      e.target.value,
      patchFormValues,
      updateFormStepDetails,
    );
  };

  updateFormStepDetails(
    LineItemSections.CompanySizeCount,
    LineItemFields.IsCompanySizeEmployeeCountCustom,
    { onChange },
  );
};
