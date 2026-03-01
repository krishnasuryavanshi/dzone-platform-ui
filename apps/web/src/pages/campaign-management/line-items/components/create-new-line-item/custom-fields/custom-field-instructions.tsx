import { Form, Input } from 'antd';
import { FC } from 'react';

const { TextArea } = Input;

export const CustomFieldInstructions: FC = () => {
  return (
    <Form.Item
      name='customFieldInstructions'
      label='Custom Field Instructions if any'
      className='input-control form-control-item'>
      <TextArea
        placeholder='Enter Custom Field Instructions'
        className='input-field'
        rows={2}
      />
    </Form.Item>
  );
};
