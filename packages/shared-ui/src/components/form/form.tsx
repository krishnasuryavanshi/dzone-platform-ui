import { Form as AntdForm } from 'antd';

export { AntdForm as Form };
export type { FormProps } from 'antd';

export const useForm = AntdForm.useForm;
export const useWatch: typeof AntdForm.useWatch = AntdForm.useWatch;
