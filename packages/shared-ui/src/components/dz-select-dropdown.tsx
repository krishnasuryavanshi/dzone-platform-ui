import React, { FC } from 'react';
import { Select } from 'antd';

// TODO: Migrate full DzSelectDropdown from dzone-ui when needed
interface DzSelectDropdownProps {
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

export const DzSelectDropdown: FC<DzSelectDropdownProps> = ({
  options = [],
  onApply,
  selected,
  ...rest
}) => (
  <Select
    placeholder='Select'
    options={options.map((opt) => ({ label: opt.text, value: opt.value }))}
    onChange={(val) => onApply?.([val])}
    value={selected?.[0]}
    style={{ minWidth: '10rem' }}
    allowClear
    {...rest}
  />
);
