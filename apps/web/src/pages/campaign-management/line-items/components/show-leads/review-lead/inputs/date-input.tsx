import { DatePicker, Input } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { FC, useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import type { Dayjs } from 'dayjs';

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface DateInputProps {
  placeholder?: string;
  value?: Dayjs | string;
  format?: string;
  onChange?: (date: Dayjs | null, dateString: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export const DateInput: FC<DateInputProps> = ({
  format = 'YYYY-MM-DD',
  value,
  onChange,
  disabled,
  className,
  ...rest
}) => {
  const [internalDateValue, setInternalDateValue] = useState<
    Dayjs | undefined
  >();
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse the date value from various possible input formats
  const getParsedDate = (
    val: string | Dayjs | undefined,
  ): Dayjs | undefined => {
    if (!val) return undefined;

    if (dayjs.isDayjs(val)) {
      return val;
    }

    if (typeof val === 'string') {
      // Remove any time component if it exists
      const dateOnly = val.split('T')[0];

      // List of formats to try - prioritize common backend formats
      const formatsToTry = [
        'YYYY-MM-DD',
        'DD-MM-YYYY',
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'MM-DD-YYYY',
        'YYYY-MM-DDTHH:mm:ss',
        'YYYY-MM-DDTHH:mm:ss.SSS',
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
        format, // Also try the configured format
      ];

      // Try each format
      for (const fmt of formatsToTry) {
        const parsed = dayjs(val, fmt, true);
        if (parsed.isValid()) {
          return parsed;
        }
      }

      // If no format matched, try parsing the date-only part
      for (const fmt of formatsToTry) {
        const parsed = dayjs(dateOnly, fmt, true);
        if (parsed.isValid()) {
          return parsed;
        }
      }

      // Last resort: try generic parsing
      const genericParsed = dayjs(val);
      if (genericParsed.isValid()) {
        return genericParsed;
      }
    }

    return undefined;
  };

  useEffect(() => {
    // Parse and set the date value
    if (typeof value === 'string') {
      // Store the raw backend value for display
      const cleanValue = value.split('T')[0];
      setDisplayValue(cleanValue);
      setInternalDateValue(getParsedDate(value));
    } else if (dayjs.isDayjs(value)) {
      setInternalDateValue(value);
      setDisplayValue(value.format(format));
    } else {
      setDisplayValue('');
      setInternalDateValue(undefined);
    }
  }, [value]);

  // Handle onChange to ensure the date is formatted correctly
  const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
    if (onChange) {
      if (date) {
        // Format according to the configured format when user selects
        const formattedDateString = date.format(format);
        setInternalDateValue(date);
        setDisplayValue(formattedDateString);
        onChange(date, formattedDateString);
      } else {
        setInternalDateValue(undefined);
        setDisplayValue('');
        onChange(date, dateString);
      }
    }
  };

  // Handle picker open/close
  const handleOpenChange = (open: boolean) => {
    setIsPickerOpen(open);

    // Call original onOpenChange if it exists
    if (rest.onOpenChange) {
      rest.onOpenChange(open);
    }
  };

  // Handle input click to open the date picker
  const handleInputClick = () => {
    if (!disabled) {
      setIsPickerOpen(true);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Visible input that shows raw backend value */}
      <Input
        value={displayValue}
        placeholder={rest.placeholder || 'Select date'}
        disabled={disabled}
        className={className}
        suffix={<CalendarOutlined />}
        onClick={handleInputClick}
        readOnly
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      />

      {/* Hidden DatePicker for calendar functionality */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          pointerEvents: isPickerOpen ? 'auto' : 'none',
        }}>
        <DatePicker
          format={format}
          style={{ width: '100%', height: '100%' }}
          value={internalDateValue}
          onChange={handleChange}
          disabled={disabled}
          suffixIcon={<CalendarOutlined />}
          placeholder={rest.placeholder || 'Select date'}
          allowClear={false}
          {...rest}
          onOpenChange={handleOpenChange}
          open={isPickerOpen}
          getPopupContainer={() => document.body}
        />
      </div>
    </div>
  );
};
