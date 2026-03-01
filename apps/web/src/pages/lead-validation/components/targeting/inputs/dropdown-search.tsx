import { type FC, useEffect, useState } from 'react';
import { Flex, Input, Typography } from 'antd';
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Hideable } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';

const { Text } = Typography;

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

export const DropdownSearch: FC<Props> = ({ attribute, sectionName }) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchText, setSearchText] = useState('');
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
    const filtered = (attribute.options || [])
      .filter(
        ({ label }: { label: string }) =>
          !searchText.trim() ||
          label.toLowerCase().includes(searchText.trim().toLowerCase()),
      )
      .map(({ label, value }: { label: string; value: string }) => ({ label, value }));
    setOptions(filtered);
  }, [searchText]);

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

  return (
    <Flex vertical>
      <div style={{ marginBottom: '0.5rem' }}>
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
          style={{ height: '2.5rem', backgroundColor: '#fff' }}
          suffix={<SearchOutlined />}
          placeholder="Search"
          disabled={isReadOnly}
        />
      </div>
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
    </Flex>
  );
};
