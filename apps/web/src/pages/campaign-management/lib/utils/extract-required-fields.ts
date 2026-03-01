interface IStepSectionConfig {
  fields?: { field: string; rules?: any[] }[];
}

interface IFormConfig<S extends string | number | symbol> {
  steps: Record<S, IStepSectionConfig[]>;
}

export const extractRequiredFields = <
  T extends string,
>(
  formConfig: IFormConfig<T>,
  upToStep: number
): string[] => {
  const allFields: string[] = [];
  for (const step of Object.keys(formConfig.steps) as T[]) {
    const currentStep = step;
    if (Number(currentStep) > upToStep) {
      break;
    }

    const fields = formConfig.steps[currentStep];
    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        if (field.fields) {
          field.fields.forEach((innerField) => {
            if (innerField.rules && innerField.rules.some((rule: any) => (rule as { required: boolean }).required)) {
              allFields.push(innerField.field);
            }
          });
        }
      });
    }
  }
  return allFields;
};
