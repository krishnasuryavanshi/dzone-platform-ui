import { JobFieldGroup } from '../constants/job-field-group';
import { LeadValidationFormField } from '../enums/lead-validation-form-field.enum';

export const transformJobTitles = (
  leadDelta: Record<string, any>,
  leadFormData: Record<string, any>,
) => {
  const withJobGroupFields = { ...leadDelta };
  const hasJobGroupKeysExistsDelta = Object.keys(leadDelta).some((key) =>
    JobFieldGroup.includes(key as LeadValidationFormField),
  );
  if (hasJobGroupKeysExistsDelta) {
    JobFieldGroup.forEach((jobGroupKey) => {
      withJobGroupFields[jobGroupKey] = leadFormData[jobGroupKey] || '';
    });
  }
  return withJobGroupFields;
};
