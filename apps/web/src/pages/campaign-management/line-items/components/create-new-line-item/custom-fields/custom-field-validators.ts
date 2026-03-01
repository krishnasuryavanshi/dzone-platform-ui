import type { FormInstance } from 'antd';

/**
 * Validates that inclusion and exclusion values don't have duplicates
 */
export const validateInclusionexclusion = (
  fieldIndex: number,
  form: FormInstance,
  currentField: 'inclusion' | 'exclusion',
) => {
  return {
    validator: (_: any, value: string[] | undefined) => {
      if (!value || value.length === 0) {
        return Promise.resolve();
      }

      const otherField =
        currentField === 'inclusion' ? 'exclusion' : 'inclusion';
      const otherValues =
        form.getFieldValue(['customFields', fieldIndex, otherField]) || [];

      // Check if any value in current field exists in the other field
      const duplicates = value.filter((val) => otherValues.includes(val));

      if (duplicates.length > 0) {
        return Promise.reject(
          new Error(
            `Value "${duplicates[0]}" cannot exist in both inclusion and suppression`,
          ),
        );
      }

      return Promise.resolve();
    },
  };
};
