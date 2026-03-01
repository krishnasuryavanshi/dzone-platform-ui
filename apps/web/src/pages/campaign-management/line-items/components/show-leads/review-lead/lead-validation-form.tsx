import { MapFunction } from '@dzone/shared-ui';
import { Form } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { LeadValidationStatus } from '../../../lib/enums';
import { IGNORE_VALIDATION_ERRORS_STATUSES } from '../../../lib/constants';
import { LeadError } from './lead-review-container';
import { LeadValidationFormItem } from './lead-validation-form-item';
import {
  validateByDataType,
  CUSTOM_DATE_FORMATS,
} from '../../../lib/utils/custom-fields';

interface ILeadValidationFormProps {
  initialValues: Record<string, any>;
  handleFormValueChange: (formValue: Record<string, any>) => void;
  leadErrorMessages: LeadError[];
  leadValidationStatus: string;
  handleRevalidateDisability: (status: boolean) => void;
  leadReviewFormConfig: Record<string, any>[];
}

export const LeadValidationForm: FC<ILeadValidationFormProps> = ({
  initialValues,
  handleFormValueChange,
  leadErrorMessages,
  leadValidationStatus,
  handleRevalidateDisability,
  leadReviewFormConfig,
}) => {
  const [form] = Form.useForm();
  const prevValuesRef = useRef<Record<string, any>>(initialValues);

  const RequiredFields = leadReviewFormConfig
    .filter((field) => field.isRequired)
    .map((field) => field.name);

  const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});
  const [mandatoryFieldErrors, setMandatoryFieldErrors] = useState<Record<string, any>>(
    {},
  );

  const parseErrorMessages = (message: string) => {
    return message.split('|').map((msg) => msg.trim());
  };

  useEffect(() => {
    // if initialValue has required field as empty, handleRevalidateDisability true
    const emptyRequiredFields = {} as Record<string, any>;
    RequiredFields.filter((field) => !initialValues[field]).forEach((field) => {
      emptyRequiredFields[field] = 'This field is required.';
    });
    setMandatoryFieldErrors(emptyRequiredFields);
  }, [initialValues]);

  useEffect(() => {
    // Reset form with new initial values
    form.resetFields();
    form.setFieldsValue(initialValues);
    prevValuesRef.current = initialValues;
  }, [initialValues, form]);

  useEffect(() => {
    if (leadErrorMessages.length > 0) {
      const formErrors = leadErrorMessages
        .filter((error) => error.message)
        .map((error) => ({
          name: error.field,
          errors: !IGNORE_VALIDATION_ERRORS_STATUSES.includes(
            leadValidationStatus as LeadValidationStatus,
          )
            ? parseErrorMessages(error.message)
            : [],
        }));

      setLocalErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        leadErrorMessages.forEach((error) => {
          if (error.message) {
            updatedErrors[error.field] = parseErrorMessages(error.message);
          }
        });
        return updatedErrors;
      });
      form.setFields(formErrors);
    }
  }, [leadErrorMessages, leadValidationStatus, form]);

  useEffect(() => {
    const invalidMandatoryFields = Object.keys(mandatoryFieldErrors).filter(
      (field) => mandatoryFieldErrors[field],
    );
    handleRevalidateDisability(invalidMandatoryFields.length > 0);
  }, [mandatoryFieldErrors]);

  const validateField = (field: Record<string, any>) => {
    return async (_: any, value: any) => {
      const fieldName = field.name;
      const errorMessages = localErrors[fieldName];
      const isMandatoryField = RequiredFields.includes(fieldName);

      if (errorMessages && errorMessages.length > 0) {
        if (isMandatoryField) {
          setMandatoryFieldErrors({
            ...mandatoryFieldErrors,
            [fieldName]: errorMessages.join(' | '),
          });
        }
        return Promise.reject(new Error(errorMessages.join(' | '))); // Join multiple messages with '|'
      }

      if (isMandatoryField && (!value || value.toString().trim() === '')) {
        setMandatoryFieldErrors({
          ...mandatoryFieldErrors,
          [fieldName]: 'This field is required.',
        });
        return Promise.reject(new Error('This field is required.'));
      }

      if (isMandatoryField) {
        setMandatoryFieldErrors({
          ...mandatoryFieldErrors,
          [fieldName]: null,
        });
      }

      // Skip client-side validation for date fields with custom formats
      // The backend will handle validation for these fields
      const fieldType = field.type?.toLowerCase();
      const isCustomDateField =
        fieldType === 'date' &&
        field.format &&
        CUSTOM_DATE_FORMATS.includes(field.format as any);

      if (!isCustomDateField) {
        // Don't format date values, keep them as-is
        const result = validateByDataType(value, field.type, field.format);

        if (!result.valid) {
          return Promise.reject(new Error(result.message));
        }
      }

      return Promise.resolve();
    };
  };

  const renderFormItem = (field: Record<string, any>, index: number) => {
    return (
      <LeadValidationFormItem
        key={index}
        field={field}
        validateField={validateField}
      />
    );
  };

  const handleValuesChange = (
    changedValues: Record<string, any>,
    allValues: Record<string, any>,
  ) => {
    const changedField = Object.keys(changedValues)[0];
    const changedValue = changedValues[changedField];
    const originalValue = initialValues[changedField];
    if (changedValue !== originalValue) {
      setLocalErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[changedField];
        return newErrors;
      });
      form.setFields([
        {
          name: changedField,
          errors: [],
        },
      ]);
    }

    const error = leadErrorMessages.find(
      (error) => error.field === changedField,
    );
    if (changedValue === originalValue && error && error.message) {
      const errorMessages = parseErrorMessages(error.message);
      form.setFields([
        {
          name: changedField,
          errors: errorMessages,
        },
      ]);
      setLocalErrors((prevErrors) => ({
        ...prevErrors,
        [changedField]: errorMessages,
      }));
    }
    prevValuesRef.current = allValues;
    handleFormValueChange(allValues);
  };

  return (
    <Form
      layout='vertical'
      initialValues={initialValues}
      form={form}
      onValuesChange={handleValuesChange}>
      <MapFunction items={leadReviewFormConfig} renderItem={renderFormItem} />
    </Form>
  );
};
