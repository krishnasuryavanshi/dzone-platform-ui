import { FormInstance } from 'antd';
import { ICustomRangeDetails } from '../../types';
import { customRangeFieldValidations } from './custom-range-field-validations';
import { LineItemFields } from '../../enums';
import {
  LOWER_NUMBER_EROR_MESSAGE,
  MAX_GREATER_THAN_MIN_ERROR_MESSAGE,
  MINIMUM_VALUE_REQURIED_ERROR_MESSAGE,
} from '../../../../lib/constants';

export const createCustomRangeValidator = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
  formSection: string,
  formField: string,
  customRangeLimit: ICustomRangeDetails,
  form: FormInstance<any>,
  rangeType: 'max' | 'min',
  oppositeField: LineItemFields,
) => {
  const onChange = (range: string) => {
    const oppositeCountValue = form.getFieldValue(oppositeField);
    const oppositeCountError = form.getFieldError(oppositeField)[0];

    const errorMessage = customRangeFieldValidations(
      form,
      formField,
      range,
      customRangeLimit,
    );

    if (!errorMessage) {
      patchFormValues({
        [formField]: range,
        error: '',
      });

      if (
        (rangeType === 'max' &&
          oppositeCountError === LOWER_NUMBER_EROR_MESSAGE &&
          range > oppositeCountValue) ||
        (rangeType === 'min' &&
          oppositeCountError === MAX_GREATER_THAN_MIN_ERROR_MESSAGE &&
          range < oppositeCountValue)
      ) {
        form.setFields([{ name: oppositeField, errors: [] }]);
      }
    } else {
      patchFormValues({ error: errorMessage });
    }
  };

  const customValidator = {
    validator: (_: any, value: string) => {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        return Promise.reject(MINIMUM_VALUE_REQURIED_ERROR_MESSAGE);
      }
      const error = customRangeFieldValidations(
        form,
        formField,
        value,
        customRangeLimit,
      );
      return error ? Promise.reject(error) : Promise.resolve();
    },
  };

  updateFormStepDetails(formSection, formField, {
    onChange,
    rules: [customValidator],
  });
};
