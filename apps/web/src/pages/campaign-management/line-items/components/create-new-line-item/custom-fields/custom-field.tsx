import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { FC } from 'react';
import { AddCustomFieldButton } from './add-custom-field-button';
import { CustomFieldRow } from './custom-field-row';

const { List: FormList } = Form;

interface ICustomFieldProps {
  form: FormInstance;
}

const MAX_CUSTOM_FIELDS = 10;

export const CustomField: FC<ICustomFieldProps> = ({ form }) => {
  const handleAddField = (add: (defaultValue?: any) => void) => {
    add({ type: 'Text' });
  };

  return (
    <FormList name='customFields'>
      {(fields, { add, remove }) => (
        <>
          <AddCustomFieldButton
            add={() => handleAddField(add)}
            disabled={fields.length >= MAX_CUSTOM_FIELDS}
          />

          {fields.map(({ key, name }, index) => (
            <CustomFieldRow
              key={key}
              field={name}
              index={index}
              remove={remove}
              form={form}
            />
          ))}
        </>
      )}
    </FormList>
  );
};
