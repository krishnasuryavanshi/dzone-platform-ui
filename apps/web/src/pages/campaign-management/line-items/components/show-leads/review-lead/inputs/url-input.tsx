import { Input } from 'antd';
import { FC } from 'react';

interface UrlInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const UrlInput: FC<UrlInputProps> = ({ ...rest }) => {
  return <Input type='url' {...rest} />;
};
