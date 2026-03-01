import { InputNumber } from 'antd';
import { FC } from 'react';

interface NumberInputProps {
  placeholder?: string;
  value?: number;
}

export const NumberInput: FC<NumberInputProps> = ({ ...rest }) => {
  return <InputNumber {...rest} style={{ width: '100%' }} />;
};
