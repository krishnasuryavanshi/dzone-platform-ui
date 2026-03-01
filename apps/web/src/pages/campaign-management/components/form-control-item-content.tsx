// TODO: Migrate FormControlItemContent from dzone-ui
import { FC } from 'react';
import { Col, Form, Input } from 'antd';

interface FormControlItemContentProps {
  item?: any;
  colLayout?: Record<string, number>;
  lists?: Record<string, any[]>;
  transKey?: string;
  key?: string | number;
}

export const FormControlItemContent: FC<FormControlItemContentProps> = ({
  item,
  colLayout,
}) => {
  if (!item) return null;
  return (
    <Col {...colLayout}>
      <Form.Item
        label={item.label}
        name={item.name || item.field}
        className='input-control form-control-item'
      >
        <Input placeholder={item.placeholder || item.label} onBlur={item.onBlur} />
      </Form.Item>
    </Col>
  );
};
