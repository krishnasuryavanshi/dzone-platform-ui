import { notification } from 'antd';
import { SelectedDeliveryMethod } from '../enums';
import { t } from 'i18next';

export const validateCombinedData = (
  data: Record<string, any>,
  requiredFields: string[],
): boolean => {
  if (data.customerSuccessManagerId) {
    requiredFields = requiredFields.filter(
      (field) => field !== 'customerSuccessManager',
    );
  }
  if (data.customerSuccessRepId) {
    requiredFields = requiredFields.filter(
      (field) => field !== 'customerSuccessRep',
    );
  }
  const errors = validateForm(data, requiredFields);
  if (Object.keys(errors).length > 0) {
    const missingFields = Object.keys(errors)
      .map((field) => t(`form.createLineItem.${field}.label`))
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
): boolean => {
  const errors: any = {};
  requiredFields.forEach((requiredField) => {
    if (data[requiredField] === undefined || data[requiredField] === null) {
      errors[requiredField] = 'This field is required';
    }
  });
  if (
    Object.values(SelectedDeliveryMethod).includes(data.deliveryMethod) &&
    !data.integrateConverterId
  ) {
    errors.integrateConverterId = 'This field is required';
  }
  if (data.isJobTitleListIncluded && !data.jobTitleListUploadId) {
    errors.jobTitleFileDetails = 'This field is required';
  }
  if (data.leadDeliveryTemplateFileIncluded && !data.deliveryTemplateId) {
    errors.deliveryTemplate = 'This field is required';
  }
  if (data.isTalIncluded && !data.talUploadId) {
    errors.talFileDetails = 'This field is required';
  }
  if (data.isSuppressionListIncluded && !data.suppressionUploadId) {
    errors.suppressionFileDetails = 'This field is required';
  }
  if (data.isIntentTargeting && !data.intentKeywordsUploadId) {
    errors.intentKeywordFileDetails = 'This field is required';
  }
  if (data.isTechnographicTargeting && !data.technologyUploadId) {
    errors.technologyFileDetails = 'This field is required';
  }
  return errors;
};
