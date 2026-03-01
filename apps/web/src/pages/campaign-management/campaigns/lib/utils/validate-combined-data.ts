import { notification } from 'antd';
import { t } from 'i18next';

export const validateCombinedData = (
  data: Record<string, any>,
  requiredFields: string[],
): boolean => {
  const errors = validateForm(data, requiredFields);
  if (Object.keys(errors).length > 0) {
    const missingFields = Object.keys(errors)
      .map((field) => t(`form.createCampaign.${field}.label`))
      .join(', ');
    const errorMessage = `Fields are missing: ${missingFields}`;
    notification.error({ message: errorMessage });
    return false;
  }
  return true;
};

const validateForm = (
  data: Record<string, any>,
  requiredFields: string[],
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const excludedFields = ['marketerCode']; // Exclude "marketerCode" from validation since only tenantCode is saved.
  requiredFields.forEach((requiredField) => {
    if (excludedFields.includes(requiredField)) {
      return;
    }
    if (data[requiredField] === undefined || data[requiredField] === null) {
      errors[requiredField] = 'This field is required';
    }
  });

  return errors;
};
