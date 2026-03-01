import { Input } from 'antd';
import { FC } from 'react';

interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const TextInput: FC<TextInputProps> = ({ ...rest }) => {
  return <Input {...rest} />;
};
