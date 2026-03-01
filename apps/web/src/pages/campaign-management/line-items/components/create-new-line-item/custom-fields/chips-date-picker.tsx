import { notification, DatePicker, Flex } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FC, useEffect, useRef } from 'react';
import { ChipItem } from './chip-item';

dayjs.extend(customParseFormat);

interface IChipsDatePickerProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  format: string;
  fieldName?: (string | number)[];
  form?: any;
}

export const ChipsDatePicker: FC<IChipsDatePickerProps> = ({
  value = [],
  onChange,
  placeholder = 'Select Date',
  format,
  fieldName,
  form,
}) => {
  const prevFormatRef = useRef<string>(format);
  const lastAddedRef = useRef<{ date: string; time: number } | null>(null);

  useEffect(() => {
    // When format changes, re-format all existing date chips
    if (
      prevFormatRef.current &&
      prevFormatRef.current !== format &&
      value.length > 0
    ) {
      const reformattedDates = value.map((dateStr) => {
        const parsedDate = dayjs(dateStr, prevFormatRef.current, true);
        if (parsedDate.isValid()) {
          return parsedDate.format(format);
        }
        return dateStr; // Keep original if parsing fails
      });
      onChange?.(reformattedDates);
    }
    prevFormatRef.current = format;
  }, [format, value, onChange]);

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) {
      return;
    }

    const formattedDate = date.format(format);
    const now = Date.now();

    // Skip if this date was just added (within 100ms) - prevents double trigger on "Today" click
    if (
      lastAddedRef.current?.date === formattedDate &&
      now - lastAddedRef.current.time < 100
    ) {
      return;
    }

    // Check for duplicates in current field
    if (value.includes(formattedDate)) {
      notification.error({
        message: 'This date has already been added',
      });
      return;
    }

    // Check if value exists in opposite field (inclusion/suppression conflict)
    if (form && fieldName && fieldName.length >= 2) {
      const currentFieldName = fieldName[fieldName.length - 1];
      const siblingFieldName =
        currentFieldName === 'inclusion' ? 'exclusion' : 'inclusion';

      // Construct the full path: ['customFields', fieldIndex, siblingFieldName]
      const siblingPath = ['customFields', fieldName[0], siblingFieldName];
      const siblingValues = form.getFieldValue(siblingPath) || [];

      if (siblingValues.includes(formattedDate)) {
        notification.error({
          message: `Date "${formattedDate}" cannot exist in both inclusion and suppression`,
        });
        return;
      }
    }

    // Track this addition to prevent duplicate notifications
    lastAddedRef.current = { date: formattedDate, time: Date.now() };

    // Add date chip
    const newValue = [...value, formattedDate];
    onChange?.(newValue);
  };

  const handleRemoveChip = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
  };

  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{
        width: '100%',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '0.25rem 1rem 1rem 1rem',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset',
        backgroundColor: '#fff',
      }}>
      <DatePicker
        variant='borderless'
        placeholder={placeholder}
        format={format}
        onChange={handleDateChange}
        style={{ width: '100%' }}
        value={null}
      />
      {value.length > 0 && (
        <Flex gap='0.5rem' wrap='wrap'>
          {value.map((chip, index) => (
            <ChipItem
              key={index}
              label={chip}
              onClose={() => handleRemoveChip(index)}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};
