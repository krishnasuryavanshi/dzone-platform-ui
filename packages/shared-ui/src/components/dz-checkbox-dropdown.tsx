import React, { FC } from 'react';
import { Select } from 'antd';

// TODO: Migrate full DzCheckboxDropdown from dzone-ui when needed
interface DzCheckboxDropdownProps {
  label?: React.ReactNode;
  options?: { value: string; text: string }[];
  onApply?: (values: string[]) => void;
  onReset?: (values: string[]) => void;
  selected?: string[];
  isFileType?: string;
  renderButton?: FC<{ onClick: (e: any) => void }>;
  instantFilter?: boolean;
  [key: string]: any;
}

export const DzCheckboxDropdown: FC<DzCheckboxDropdownProps> = ({
  options = [],
  onApply,
  selected,
  ...rest
}) => (
  <Select
    mode='multiple'
    placeholder='Select'
    options={options.map((opt) => ({ label: opt.text, value: opt.value }))}
    onChange={onApply}
    value={selected}
    style={{ minWidth: '10rem' }}
    allowClear
    {...rest}
  />
);
