import { type FC, useEffect, useState } from 'react';
import { Select } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';

interface Props {
  section: Record<string, any>;
  isDisabled: boolean;
}

export const ValidationRuleDropdown: FC<Props> = ({ section, isDisabled }) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [selected, setSelected] = useState('');
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected(Object.keys(selectedValues[section.name] || {})?.[0] || '');
  }, [selectedValues, section]);

  useEffect(() => {
    const newOptions = (section?.attributes?.[0]?.options || []).map(
      (item: Record<string, any>) => ({ label: item.label, value: item.value }),
    );
    setOptions(newOptions);
  }, [section]);

  const handleChange = (value: string) => {
    setSelectedValues(section.name, { [value]: true });
  };

  return (
    <div style={{ width: '100%' }}>
      <Select
        showSearch
        optionFilterProp="label"
        placeholder={`Select ${section.label}`}
        onChange={handleChange}
        options={options}
        value={selected}
        disabled={isDisabled}
        style={{ width: '100%', maxWidth: '20rem', backgroundColor: '#fff' }}
      />
    </div>
  );
};
