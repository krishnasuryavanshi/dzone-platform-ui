import { FieldType } from '@dzone/shared-lib';

export const extractFieldNamesForValidation = (
  sections: any[]
) => {
  const requiredFieldNames: string[] = [];
  sections.forEach((section) => {
    section.fields.forEach((field: any) => {
      if (
        field.fieldType === FieldType.Text ||
        field.fieldType === FieldType.TextArea
      ) {
        const fieldName = field.field;
        if (typeof fieldName === 'string') {
          requiredFieldNames.push(fieldName);
        }
      }
    });
  });
  return requiredFieldNames;
};
