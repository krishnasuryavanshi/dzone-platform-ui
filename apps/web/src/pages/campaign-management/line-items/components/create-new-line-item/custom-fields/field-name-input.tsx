import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { FC } from 'react';
import {
  STANDARD_FIELD_NAMES,
  normalizeFieldName,
} from '../../../lib/constants/standard-fields';

const { TextArea } = Input;

interface IFieldNameInputProps {
  name: (string | number)[];
  form: FormInstance;
  fieldIndex: number;
}

export const FieldNameInput: FC<IFieldNameInputProps> = ({
  name,
  form,
  fieldIndex,
}) => {
  const validateUniqueLabel = (_: any, value: string) => {
    if (!value) return Promise.resolve();

    const customFields = form.getFieldValue('customFields') || [];
    const duplicates = customFields.filter(
      (field: any, index: number) =>
        index !== fieldIndex &&
        field?.label?.toLowerCase().trim() === value.toLowerCase().trim(),
    );

    if (duplicates.length > 0) {
      return Promise.reject('This field name already exists');
    }

    return Promise.resolve();
  };

  const validateNotStandardField = (_: any, value: string) => {
    if (!value) return Promise.resolve();

    const normalizedInput = normalizeFieldName(value.trim());
    const isStandardField = STANDARD_FIELD_NAMES.some(
      (field) => normalizeFieldName(field) === normalizedInput,
    );

    if (isStandardField) {
      return Promise.reject(
        'This field name is reserved and already exists as a standard field. Please choose a different name.',
      );
    }

    return Promise.resolve();
  };

  return (
    <Form.Item
      name={name}
      label='Field Name'
      rules={[
        { required: true, message: 'Field label is required' },
        { validator: validateUniqueLabel },
        { validator: validateNotStandardField },
      ]}
      className='input-control form-control-item'>
      <TextArea
        placeholder='Enter Custom Field Name'
        className='input-field'
        rows={2}
      />
    </Form.Item>
  );
};
