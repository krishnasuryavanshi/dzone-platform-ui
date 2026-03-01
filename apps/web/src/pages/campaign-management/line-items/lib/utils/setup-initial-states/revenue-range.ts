import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';

export const setUpRevenueRange = (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const isCustomRange = form.getFieldValue(
    LineItemFields.IsCompanySizeRevenueCustom,
  );
  patchFormValues({
    [LineItemFields.IsCompanySizeRevenueCustom]:
      isCustomRange === undefined ? false : isCustomRange,
  });
  updateRevenueCustomRangeField(
    isCustomRange,
    patchFormValues,
    updateFormStepDetails,
  );
};

export const updateRevenueCustomRangeField = (
  isCustomRange: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const props = {
    disabled: isCustomRange,
  };
  if (isCustomRange) {
    patchFormValues({
      [LineItemFields.CompanySizesRevenue]: [],
    });
  } else {
    patchFormValues({
      [LineItemFields.CompanySizeRevenueCustomRangeMin]: null,
      [LineItemFields.CompanySizeRevenueCustomRangeMax]: null,
    });
  }
  const minMaxProps = {
    disabled: !isCustomRange,
  };
  updateFormStepDetails(
    LineItemSections.CompanySizeRevenue,
    LineItemFields.CompanySizesRevenue,
    props,
  );

  updateFormStepDetails(
    LineItemSections.CompanySizeRevenue,
    LineItemFields.CompanySizeRevenueCustomRangeMin,
    minMaxProps,
  );
  updateFormStepDetails(
    LineItemSections.CompanySizeRevenue,
    LineItemFields.CompanySizeRevenueCustomRangeMax,
    minMaxProps,
  );
};
