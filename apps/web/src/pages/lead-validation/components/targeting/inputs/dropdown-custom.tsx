import { type FC, useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Hideable } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { DropdownCustomAddOptions } from './dropdown-custom-add-options';

const { Text } = Typography;

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

export const DropdownCustom: FC<Props> = ({ attribute, sectionName }) => {
  const [isCustomOptionFormOpened, setIsCustomOptionFormOpened] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const { selectedValues, setSelectedValues, isReadOnly } = useValidationSettingStore();

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data?.length > 0) {
      setSelectedOptions(selectedValues[sectionName][attribute.name].data);
    } else {
      setSelectedOptions([]);
    }
  }, [selectedValues]);

  useEffect(() => {
    if (attribute.options?.length > 0) {
      setOptions(
        attribute.options.map(({ label, value }: { label: string; value: string }) => ({
          label,
          value,
        })),
      );
    } else {
      setOptions([]);
    }
  }, [attribute]);

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data?.length > 0) {
      const selected = selectedValues[sectionName][attribute.name].data || [];
      if (selected?.length) {
        setOptions((prev) => {
          const existingValues = prev.map((option) => option.value);
          const newOptions = selected
            .filter((opt: string) => !existingValues.includes(opt))
            .map((opt: string) => ({ label: opt, value: opt }));
          return [...prev, ...newOptions];
        });
      }
    }
  }, [selectedValues]);

  const handleOptionSelect = (value: string) => {
    const sectionSelection = selectedValues?.[sectionName];
    const attributeSelection = sectionSelection?.[attribute.name] || {
      type: 'OPTIONS',
      data: [],
    };

    if (attributeSelection.data.includes(value)) {
      attributeSelection.data = attributeSelection.data.filter((o: string) => o !== value);
    } else {
      attributeSelection.data.push(value);
    }

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: attributeSelection,
    });
  };

  const handleAddOption = (newOption: { label: string; value: string }) => {
    setOptions((prev) => [...prev, newOption]);
    handleOptionSelect(newOption.value);
    setIsCustomOptionFormOpened(false);
  };

  if (isCustomOptionFormOpened) {
    return (
      <DropdownCustomAddOptions
        options={options}
        onAddOption={handleAddOption}
        onCancel={() => setIsCustomOptionFormOpened(false)}
      />
    );
  }

  return (
    <Flex vertical>
      <Hideable show={options.length > 1}>
        <div
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={() =>
            !isReadOnly &&
            setSelectedValues(sectionName, {
              ...selectedValues?.[sectionName],
              [attribute.name]: { type: 'OPTIONS', data: options.map((o) => o.value) },
            })
          }>
          <Text strong>Select All</Text>
        </div>
      </Hideable>
      <div style={{ maxHeight: '15rem', overflowY: 'auto', marginRight: '-6px' }}>
        {options.map(({ label, value }) => (
          <div
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              background: selectedOptions.includes(value) ? '#dce5fc' : undefined,
            }}
            key={value}
            onClick={() => !isReadOnly && handleOptionSelect(value)}>
            <Flex justify="space-between">
              <Text>{label}</Text>
              <Hideable show={selectedOptions.includes(value)}>
                <CheckOutlined style={{ color: '#2563EB' }} />
              </Hideable>
            </Flex>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: '0.25rem',
          padding: '0.5rem 1rem',
          background: '#F4F4F4',
          cursor: 'pointer',
        }}
        onClick={() => !isReadOnly && setIsCustomOptionFormOpened(true)}>
        <Text style={{ fontSize: '0.875rem' }}>+ Add a custom range</Text>
      </div>
    </Flex>
  );
};
