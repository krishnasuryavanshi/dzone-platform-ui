import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';

export const setUpCountRange = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const isCustomRange = form.getFieldValue(
    LineItemFields.IsCompanySizeEmployeeCountCustom,
  );

  patchFormValues({
    [LineItemFields.IsCompanySizeEmployeeCountCustom]: isCustomRange ?? false,
  });

  updateCountCustomRangeField(
    isCustomRange,
    patchFormValues,
    updateFormStepDetails,
  );
};

export const updateCountCustomRangeField = (
  isCustomRange: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const props = { disabled: isCustomRange };
  if (isCustomRange) {
    patchFormValues({
      [LineItemFields.CompanySizesEmployeeCount]: [],
    });
  } else {
    patchFormValues({
      [LineItemFields.CompanySizeEmployeeCountCustomRangeMax]: null,
      [LineItemFields.CompanySizeEmployeeCountCustomRangeMin]: null,
    });
  }

  updateFormStepDetails(
    LineItemSections.CompanySizeCount,
    LineItemFields.CompanySizesEmployeeCount,
    props,
  );

  const minMaxProps = { disabled: !isCustomRange };

  updateFormStepDetails(
    LineItemSections.CompanySizeCount,
    LineItemFields.CompanySizeEmployeeCountCustomRangeMin,
    minMaxProps,
  );
  updateFormStepDetails(
    LineItemSections.CompanySizeCount,
    LineItemFields.CompanySizeEmployeeCountCustomRangeMax,
    minMaxProps,
  );
};
