import { type FC, useEffect, useState } from 'react';
import { Flex, Input, Typography, notification } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { ChipsInput } from './chips-input';
import { validateChipValue } from '../../../lib/chip-utils';
import React from 'react';

const { Text } = Typography;

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

const INVALID_MESSAGE = 'Invalid value. Only letters, numbers, spaces, "&", and "-" are allowed.';

export const Chips: FC<Props> = ({ attribute, sectionName }) => {
  const { selectedValues, setSelectedValues, isReadOnly } = useValidationSettingStore();
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data?.length > 0) {
      setOptions(selectedValues[sectionName][attribute.name].data);
    } else {
      setOptions([]);
    }
  }, [selectedValues]);

  const handleAddOption = (values: string[]) => {
    const sectionSelection = selectedValues?.[sectionName];
    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: { type: 'OPTIONS', data: values },
    });
  };

  const handleRemoveOption = (value: string) => {
    const sectionSelection = selectedValues?.[sectionName];
    const filtered =
      sectionSelection?.[attribute.name]?.data?.filter((val: string) => val !== value) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: { type: 'OPTIONS', data: filtered },
    });
  };

  const handlePastedText = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    const rawValues = pastedText
      .split(/[,\t\n\s]+/)
      .map((v) => v.trim().replace(/\s+/g, ' '))
      .filter((v) => v.length > 0);

    const invalidValues = rawValues.filter((v) => !validateChipValue(v));
    const validValues = rawValues.filter((v) => validateChipValue(v) && !options.includes(v));

    if (invalidValues.length > 0) {
      notification.error({ message: INVALID_MESSAGE });
    }

    if (validValues.length > 0) {
      const sectionSelection = selectedValues?.[sectionName];
      const existingData = sectionSelection?.[attribute.name]?.data || [];

      setSelectedValues(sectionName, {
        ...sectionSelection,
        [attribute.name]: { type: 'OPTIONS', data: [...existingData, ...validValues] },
      });
    }
  };

  return (
    <div
      style={{
        borderRadius: '5px',
        border: '1px solid #E9EEF4',
        padding: '1rem 1.25rem',
      }}>
      <Flex align="center" vertical gap="0.75rem" style={{ width: '100%' }}>
        <ChipsInput
          handleOptionChange={handleAddOption}
          handleRemoveOption={handleRemoveOption}
          options={options}
        />
        {options.length === 0 && (
          <>
            <Text style={{ fontSize: '1.25rem', color: '#707070' }} strong>
              Or
            </Text>
            <div style={{ width: '100%' }}>
              <Input
                disabled={isReadOnly}
                onPaste={handlePastedText}
                style={{
                  height: '3rem',
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: '#fff',
                }}
                placeholder="Copy paste here"
              />
            </div>
          </>
        )}
      </Flex>
    </div>
  );
};
