export const extractRequiredFormFields = (formConfig: any[]) => {
  const requiredFields: any[] = [];
  formConfig.forEach((section: { fields: any[] }) => {
    section.fields.forEach((field: { rules: any[]; field: any }) => {
      if (field.rules && field.rules.some((rule: { required: any }) => rule.required)) {
        requiredFields.push(field.field);
      }
    });
  });

  return requiredFields;
};
