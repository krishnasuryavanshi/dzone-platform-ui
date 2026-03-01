import { notification, Input, Flex } from 'antd';
import { FC, KeyboardEvent, useState } from 'react';
import { validateByDataType } from '../../../lib/utils/custom-fields';
import { ChipItem } from './chip-item';

interface IChipsInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  type: string;
  format?: string;
  fieldName?: (string | number)[];
  form?: any;
}

export const ChipsInput: FC<IChipsInputProps> = ({
  value = [],
  onChange,
  type,
  format,
  fieldName,
  form,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddChip = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    // Validate based on data type
    const validation = validateByDataType(trimmedValue, type, format);

    if (!validation.valid) {
      notification.error({
        message: validation.message || 'Please enter a valid value',
      });
      return;
    }

    // For Number type, convert to number for comparison
    const isNumberType = type === 'Number';
    const compareValue = isNumberType ? Number(trimmedValue) : trimmedValue;

    // Check for duplicates in current field
    const hasDuplicate = isNumberType
      ? value.some((v) => Number(v) === compareValue)
      : value.includes(trimmedValue);

    if (hasDuplicate) {
      notification.error({
        message: 'This value has already been added',
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

      const hasConflict = isNumberType
        ? siblingValues.some((v: string) => Number(v) === compareValue)
        : siblingValues.includes(trimmedValue);

      if (hasConflict) {
        notification.error({
          message: `Value "${trimmedValue}" cannot exist in both inclusion and suppression`,
        });
        return;
      }
    }

    // Add chip
    const newValue = [...value, trimmedValue];
    onChange?.(newValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault();
      handleAddChip();
    }
  };

  const handleRemoveChip = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Split by comma and newline
    const pastedValues = pastedText
      .split(/[,\n]+/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    // Get sibling field values for conflict checking
    let siblingValues: string[] = [];
    if (form && fieldName && fieldName.length >= 2) {
      const currentFieldName = fieldName[fieldName.length - 1];
      const siblingFieldName =
        currentFieldName === 'inclusion' ? 'suppression' : 'inclusion';
      // Construct the full path: ['customFields', fieldIndex, siblingFieldName]
      const siblingPath = ['customFields', fieldName[0], siblingFieldName];
      siblingValues = form.getFieldValue(siblingPath) || [];
    }

    // For Number type, convert to number for comparison
    const isNumberType = type === 'Number';

    // Process each value
    const validValues: string[] = [];
    const invalidValues: string[] = [];
    const duplicateValues: string[] = [];
    const conflictValues: string[] = [];

    pastedValues.forEach((val) => {
      const compareValue = isNumberType ? Number(val) : val;

      // Check if already exists in current values or in validValues
      const isDuplicate = isNumberType
        ? value.some((v) => Number(v) === compareValue) ||
          validValues.some((v) => Number(v) === compareValue)
        : value.includes(val) || validValues.includes(val);

      if (isDuplicate) {
        duplicateValues.push(val);
        return;
      }

      // Check if exists in opposite field (inclusion/suppression conflict)
      const hasConflict = isNumberType
        ? siblingValues.some((v: string) => Number(v) === compareValue)
        : siblingValues.includes(val);

      if (hasConflict) {
        conflictValues.push(val);
        return;
      }

      const validationResult = validateByDataType(val, type, format);
      if (validationResult.valid) {
        validValues.push(val);
      } else {
        invalidValues.push(val);
      }
    });

    // Add valid values
    if (validValues.length > 0) {
      const newValue = [...value, ...validValues];
      onChange?.(newValue);
    }

    // Show notification for errors
    if (conflictValues.length > 0) {
      notification.error({
        message: `${conflictValues.length} value(s) cannot exist in both inclusion and suppression`,
      });
    } else if (invalidValues.length > 0) {
      notification.error({
        message: `${invalidValues.length} invalid value(s) were not added`,
      });
    } else if (duplicateValues.length > 0) {
      notification.error({
        message: `${duplicateValues.length} duplicate value(s) were skipped`,
      });
    }

    // Clear input after processing paste
    setInputValue('');
  };

  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{
        width: '100%',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '1rem ',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset',
        backgroundColor: '#fff',
      }}>
      <Input
        variant='borderless'
        placeholder='Add More'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleAddChip}
        onPaste={handlePaste}
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
