import React, { useState, useEffect } from 'react';
import { Checkbox, Divider, Input, Flex, Typography } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { SearchOutlined } from '@ant-design/icons';
import { DropdownCustomAddOptions } from '../../../../lead-validation/components/targeting/inputs/dropdown-custom-add-options';

const { Text } = Typography;

interface ListSelectionEditProps {
  values: string[];
  onChange: (values: string[]) => void;
  predefinedOptions: Record<string, any>[];
  showSearch?: boolean;
  allowCustomRange?: boolean;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const ListSelectionEdit: React.FC<ListSelectionEditProps> = ({
  values,
  onChange,
  predefinedOptions,
  showSearch = false,
  allowCustomRange = false,
  searchTerm,
  onSearchTermChange,
}) => {
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [options, setOptions] = useState(predefinedOptions);

  // Add custom values from the `values` prop to the options list if they don't already exist
  useEffect(() => {
    const predefinedValues = new Set(predefinedOptions.map((opt) => opt.id));
    const customValues = values.filter((val) => !predefinedValues.has(val));

    if (customValues.length > 0) {
      const newCustomOptions = customValues.map((val) => ({
        id: val,
        label: val,
      }));
      setOptions((prevOptions) => {
        const existingOptionIds = new Set(prevOptions.map((o) => o.id));
        const uniqueNewOptions = newCustomOptions.filter(
          (no) => !existingOptionIds.has(no.id),
        );
        return [...prevOptions, ...uniqueNewOptions].sort((a, b) =>
          a?.label?.localeCompare(b.label, undefined, { numeric: true }),
        );
      });
    }
  }, [values, predefinedOptions]);

  const handleAddOption = (newOption: { label: string; value: string }) => {
    const newOpt = { id: newOption.value, label: newOption.label };
    setOptions((prev) =>
      [...prev, newOpt].sort((a, b) =>
        a?.label?.localeCompare(b.label, undefined, { numeric: true }),
      ),
    );
    // Add the new option to the list of selected values
    onChange([...values, newOption.value]);
    setIsCustomFormOpen(false);
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? [...values, value]
      : values.filter((v) => v !== value);
    onChange(newValues);
  };

  const filteredOptions = showSearch
    ? options.filter(
        (option) =>
          predefinedOptions.some((predef) => predef.id === option.id) &&
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const handleSelectAll = (e: { target: { checked: any } }) => {
    if (e.target.checked) {
      const allOptionIds = predefinedOptions.map((opt) => opt.id);
      onChange(Array.from(new Set([...values, ...allOptionIds])));
    } else {
      const allOptionIds = new Set(predefinedOptions.map((opt) => opt.id));
      onChange(values.filter((v) => !allOptionIds.has(v)));
    }
  };

  const allPredefinedSelected =
    predefinedOptions.length > 0 &&
    predefinedOptions.every((opt) => values.includes(opt.id));
  const indeterminate =
    predefinedOptions.some((opt) => values.includes(opt.id)) &&
    !allPredefinedSelected;

  return (
    <Flex vertical>
      {showSearch && (
        <Input
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          style={{ marginBottom: '1rem' }}
          prefix={<SearchOutlined />}
          allowClear
        />
      )}
      <Flex vertical gap='0.5rem' style={{ overflowY: 'auto' }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={allPredefinedSelected}
          indeterminate={indeterminate}>
          Select All
        </Checkbox>
        <Divider style={{ margin: 0 }} />
        <Flex vertical gap='1rem'>
          <MapFunction
            items={filteredOptions}
            renderItem={(option: Record<string, any>) => (
              <Checkbox
                key={option.id}
                value={option.id}
                checked={values.includes(option.id)}
                onChange={(e) =>
                  handleCheckboxChange(option.id, e.target.checked)
                }>
                {option.label}
              </Checkbox>
            )}
          />
        </Flex>
      </Flex>

      {allowCustomRange && !isCustomFormOpen && (
        <Flex
          style={{
            marginTop: '0.25rem',
            padding: '0.5rem 1rem',
            background: '#F4F4F4',
            cursor: 'pointer',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
          }}
          onClick={() => setIsCustomFormOpen(true)}>
          <Text style={{ fontSize: '0.875rem', color: '#374151' }}>
            + Add a custom range
          </Text>
        </Flex>
      )}

      {allowCustomRange && isCustomFormOpen && (
        <DropdownCustomAddOptions
          options={options.map((o) => ({ label: o.label, value: o.id }))}
          onAddOption={handleAddOption}
          onCancel={() => setIsCustomFormOpen(false)}
          variant='small'
        />
      )}
    </Flex>
  );
};
