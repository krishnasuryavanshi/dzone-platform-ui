import React, { useState } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { Dropdown, Input } from 'antd';
import { DayGrid } from './day-grid';

interface DayPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DayPicker: React.FC<DayPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  style,
}) => {
  const [open, setOpen] = useState(false);

  const handleDayClick = (day: number) => {
    onChange?.(day);
    setOpen(false);
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => (
        <DayGrid value={value} onDayClick={handleDayClick} />
      )}
      trigger={['click']}
      placement='bottomLeft'>
      <Input
        className={className}
        style={style}
        value={value ? `Day ${value}` : ''}
        placeholder={placeholder}
        suffix={<CalendarOutlined />}
        readOnly
      />
    </Dropdown>
  );
};
