import { Form } from 'antd';
import type { FormItemProps } from 'antd';

export function FormItem<T = any>(props: FormItemProps<T>) {
  return <Form.Item {...props} />;
}
