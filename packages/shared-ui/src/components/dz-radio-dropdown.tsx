import React, { FC } from 'react';
import { Select } from 'antd';

// TODO: Migrate full DzRadioDropdown from dzone-ui when needed
interface DzRadioDropdownProps {
  label?: string;
  options?: { label: string; value: string }[];
  onStatusChange?: (value: string) => void;
  disabled?: boolean;
  selected?: string;
  style?: React.CSSProperties;
}

export const DzRadioDropdown: FC<DzRadioDropdownProps> = ({
  label,
  options = [],
  onStatusChange,
  disabled,
  selected,
  style,
}) => (
  <Select
    placeholder={label}
    options={options}
    onChange={onStatusChange}
    disabled={disabled}
    value={selected}
    style={{ minWidth: '10rem', ...style }}
    allowClear
  />
);
