import { sanitizeText } from '@dzone/shared-lib';

export const fieldValidationHandler = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
  formSection: string,
  formField: string,
) => {
  const onBlur = (e: any) => {
    const { value } = e.target;
    const sanitizedValue = sanitizeText(value);
    patchFormValues({
      [formField]: sanitizedValue,
    });
  };

  updateFormStepDetails(formSection, formField, { onBlur });
};
