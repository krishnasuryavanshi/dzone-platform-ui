import { Form, Checkbox } from 'antd';
import { FC } from 'react';

interface IFieldRequiredCheckboxProps {
  name: (string | number)[];
}

export const FieldRequiredCheckbox: FC<IFieldRequiredCheckboxProps> = ({
  name,
}) => {
  return (
    <Form.Item
      name={name}
      valuePropName='checked'
      className='input-control form-control-item'>
      <Checkbox>Required</Checkbox>
    </Form.Item>
  );
};
