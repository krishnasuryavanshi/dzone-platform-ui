import { Form, Select } from 'antd';
import type { FormInstance } from 'antd';
import { FC } from 'react';
import { DATE_FORMAT_OPTIONS } from '../../../lib/constants';

interface IDateFormatSelectProps {
  name: (string | number)[];
  fieldIndex: number;
  form: FormInstance;
}

export const DateFormatSelect: FC<IDateFormatSelectProps> = ({
  name,
  fieldIndex,
  form,
}) => {
  const dataType = Form.useWatch(['customFields', `${fieldIndex}`, 'type'], form);

  if (dataType !== 'Date') {
    return null;
  }

  return (
    <Form.Item
      name={name}
      label='Date Format'
      rules={[{ required: true, message: 'Date format is required' }]}
      className='input-control form-control-item'>
      <Select placeholder='Select Format' options={DATE_FORMAT_OPTIONS} />
    </Form.Item>
  );
};
