import { useState } from 'react';

export const useFormStep = () => {
  const [formStepDetails, setFormStepDetails] = useState<any>(null);
  const [isFormStepInitialized, setIsFormStepInitialized] = useState(0);

  const updateFormStepDetails = (
    sectionName: string,
    fieldName: string,
    partialField: any,
  ) => {
    formStepDetails.step.forEach((step: any) => {
      if (step.key === sectionName) {
        step.fields.forEach((field: any) => {
          if (field.field === fieldName) {
            Object.assign(field, partialField);
          }
          if (field.children) {
            field.children.forEach((childField: any) => {
              if (childField.field === fieldName) {
                Object.assign(childField, partialField);
              }
            });
          }
        });
      }
    });
    setFormStepDetails({ ...formStepDetails });
  };

  const setFormStepDetailsInfo = (formStep: any) => {
    setFormStepDetails(formStep);
    setIsFormStepInitialized(Math.floor(Math.random() * 90000) + 10000);
  };

  const clearFormStepDetailsInfo = () => {
    setFormStepDetails(null);
    setIsFormStepInitialized(0);
  };

  return {
    formStepDetails,
    setFormStepDetailsInfo,
    clearFormStepDetailsInfo,
    updateFormStepDetails,
    isFormStepInitialized,
  };
};
