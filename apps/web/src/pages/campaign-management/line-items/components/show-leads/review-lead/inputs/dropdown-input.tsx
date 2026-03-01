import { Select } from 'antd';
import { FC } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  options?: DropdownOption[];
}

export const DropdownInput: FC<DropdownInputProps> = ({
  options = [],
  ...rest
}) => {
  return <Select options={options} {...rest} style={{ width: '100%' }} />;
};
