import { Input } from 'antd';
import { FC } from 'react';

interface PhoneInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const PhoneInput: FC<PhoneInputProps> = ({ ...rest }) => {
  return <Input type='tel' {...rest} />;
};
