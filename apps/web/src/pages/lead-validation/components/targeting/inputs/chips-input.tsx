import { type FC, useState } from 'react';
import { Flex, Input, Tag, notification } from 'antd';
import React from 'react';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import {
  processChipInput,
  shouldCreateChip,
  processPastedText,
  validateChipValue,
} from '../../../lib/chip-utils';

interface Props {
  options: string[];
  handleOptionChange: (value: string[]) => void;
  handleRemoveOption: (value: string) => void;
}

const INVALID_MESSAGE = 'Invalid value. Only letters, numbers, spaces, "&", and "-" are allowed.';

export const ChipsInput: FC<Props> = ({ options, handleOptionChange, handleRemoveOption }) => {
  const [inputValue, setInputValue] = useState('');
  const { isReadOnly } = useValidationSettingStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (shouldCreateChip(e.key)) {
      e.preventDefault();
      const value = inputValue.trim().replace(/\s+/g, ' ');
      if (!value) return;

      if (!validateChipValue(value)) {
        notification.error({ message: INVALID_MESSAGE });
        return;
      }

      if (!options.includes(value)) {
        handleOptionChange([...options, value]);
        setInputValue('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!validateChipValue(value) && value !== '') {
      notification.error({ message: INVALID_MESSAGE });
      return;
    }

    const { newValues, remainingInput } = processChipInput(value, options);
    if (newValues.length > 0) handleOptionChange([...options, ...newValues]);
    setInputValue(remainingInput);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    const values = pastedText
      .split(/[,\t\n]/)
      .map((v) => v.trim().replace(/\s+/g, ' '))
      .filter((v) => v.length > 0);

    const validValues = values.filter(validateChipValue);
    const invalidValues = values.filter((v) => !validateChipValue(v));

    if (invalidValues.length > 0) {
      notification.error({ message: `Invalid values removed: ${invalidValues.join(', ')}` });
    }

    if (validValues.length > 0) {
      const { newValues, duplicates } = processPastedText(validValues.join(','), options);

      if (duplicates.length > 0) {
        notification.error({ message: `Some values already exist: ${duplicates.join(', ')}` });
      }

      if (newValues.length > 0) handleOptionChange([...options, ...newValues]);
    }

    setInputValue('');
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <Input
          disabled={isReadOnly}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{
            height: '3rem',
            width: '100%',
            border: 'none',
            outline: 'none',
            background: '#fff',
          }}
          placeholder="Type the value and use comma (,), Enter, or Tab to separate each value into a chip"
        />
      </div>

      <Flex wrap="wrap" style={{ width: '100%' }}>
        {options.map((option, index) => (
          <Tag
            bordered={false}
            style={{ margin: '0.5rem 0.5rem 0 0', padding: '0.5rem', color: '#707070' }}
            closable
            onClose={() => !isReadOnly && handleRemoveOption(option)}
            key={`${option}-${index}`}>
            {option}
          </Tag>
        ))}
      </Flex>
    </>
  );
};
