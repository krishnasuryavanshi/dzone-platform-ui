import { Form, Select } from 'antd';
import type { FormInstance } from 'antd';
import { FC } from 'react';
import { DATA_TYPE_OPTIONS } from '../../../lib/constants';

interface IDataTypeSelectProps {
  name: (string | number)[];
  fieldIndex: number;
  form: FormInstance;
}

export const DataTypeSelect: FC<IDataTypeSelectProps> = ({
  name,
  fieldIndex,
  form,
}) => {
  const handleTypeChange = () => {
    // Clear inclusion/exclusion when type changes
    form.setFieldValue(['customFields', fieldIndex, 'inclusion'], undefined);
    form.setFieldValue(['customFields', fieldIndex, 'exclusion'], undefined);
    form.setFieldValue(['customFields', fieldIndex, 'format'], undefined);
  };

  return (
    <Form.Item
      name={name}
      label='Data Type'
      rules={[{ required: true, message: 'Data type is required' }]}
      className='input-control form-control-item'>
      <Select
        placeholder='Select Data Type'
        options={DATA_TYPE_OPTIONS}
        onChange={handleTypeChange}
      />
    </Form.Item>
  );
};
