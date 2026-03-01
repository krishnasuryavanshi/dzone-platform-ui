import { FormInstance } from 'antd';
import {
  WHOLE_NUMBER_ERROR_MESSAGE,
  LOWER_NUMBER_EROR_MESSAGE,
  MAX_GREATER_THAN_MIN_ERROR_MESSAGE,
} from '../../../../lib/constants';
import { LineItemFields } from '../../enums';
import { ICustomRangeDetails } from '../../types';

const validateDecimal = (
  value: string | null,
  errorMessage: string,
): string => {
  return value !== null && value.toString().includes('.') ? errorMessage : '';
};

const validateMaxLessThanEqual = (
  value: number | null,
  maxValue: number,
  errorMessage: string,
): string => {
  return value !== null && value >= Number(maxValue) ? errorMessage : '';
};

const validateMaxLessThan = (
  value: string | null,
  maxValue: number,
  errorMessage: string,
): string => {
  return value !== null && Number(value) > Number(maxValue) ? errorMessage : '';
};

const validateValueLessThan = (
  value: string | null,
  minValue: number | null,
  errorMessage: string,
) => {
  return value !== null && Number(value) <= Number(minValue)
    ? errorMessage
    : '';
};
export const customRangeFieldValidations = (
  form: FormInstance<any>,
  formField: string,
  value: string | null,
  customRangeLimit: ICustomRangeDetails,
) => {
  const MAX_EMPLOYEE_COUNT = customRangeLimit?.employeeCountCustomRangeMax;
  const MAX_REVENUE_COUNT = customRangeLimit?.employeeRevenueCustomRangeMax;
  const fieldValues = form.getFieldsValue();
  const {
    companySizeEmployeeCountCustomRangeMin: minCountValue,
    companySizeEmployeeCountCustomRangeMax: maxCountValue,
    companySizeRevenueCustomRangeMin: minRevenueValue,
    companySizeRevenueCustomRangeMax: maxRevenueValue,
  } = fieldValues;
  let errorMessage = '';

  switch (formField) {
    case LineItemFields.CompanySizeEmployeeCountCustomRangeMin:
      errorMessage =
        validateDecimal(value, WHOLE_NUMBER_ERROR_MESSAGE) ||
        (value === null
          ? ''
          : validateMaxLessThanEqual(
              Number(value),
              maxCountValue !== undefined && maxCountValue !== null
                ? maxCountValue
                : MAX_EMPLOYEE_COUNT,
              LOWER_NUMBER_EROR_MESSAGE,
            ));
      break;

    case LineItemFields.CompanySizeEmployeeCountCustomRangeMax:
      if (value !== null && minCountValue === 0 && Number(value) === 0) {
        errorMessage = MAX_GREATER_THAN_MIN_ERROR_MESSAGE;
      } else {
        errorMessage =
          validateDecimal(value, WHOLE_NUMBER_ERROR_MESSAGE) ||
          (minCountValue !== null
            ? validateValueLessThan(
                value,
                minCountValue,
                MAX_GREATER_THAN_MIN_ERROR_MESSAGE,
              )
            : '') ||
          validateMaxLessThan(
            value,
            MAX_EMPLOYEE_COUNT,
            LOWER_NUMBER_EROR_MESSAGE,
          );
      }
      break;

    case LineItemFields.CompanySizeRevenueCustomRangeMin:
      errorMessage =
        value === null
          ? ''
          : validateMaxLessThanEqual(
              Number(value),
              maxRevenueValue !== undefined && maxRevenueValue !== null
                ? maxRevenueValue
                : MAX_REVENUE_COUNT,
              LOWER_NUMBER_EROR_MESSAGE,
            );
      break;

    case LineItemFields.CompanySizeRevenueCustomRangeMax:
      if (value !== null && minRevenueValue === 0 && Number(value) === 0) {
        errorMessage = MAX_GREATER_THAN_MIN_ERROR_MESSAGE;
      } else {
        errorMessage =
          (minRevenueValue !== null
            ? validateValueLessThan(
                value,
                minRevenueValue,
                MAX_GREATER_THAN_MIN_ERROR_MESSAGE,
              )
            : '') ||
          validateMaxLessThan(
            value,
            MAX_REVENUE_COUNT,
            LOWER_NUMBER_EROR_MESSAGE,
          );
      }
      break;

    default:
      break;
  }

  return errorMessage || undefined;
};
