import { type FC, useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';

interface Props {
  section: Record<string, any>;
  isDisabled: boolean;
}

export const ValidationRuleNumberInput: FC<Props> = ({ section, isDisabled }) => {
  const [selected, setSelected] = useState<number>(1);
  const { selectedValues, setSelectedValues } = useValidationSettingStore();
  const key = section.attributes[0]?.name;

  useEffect(() => {
    if (key) {
      setSelected(selectedValues[section.name]?.[key] || 1);
    }
  }, [selectedValues, section, key]);

  const handleChange = (value: number | string | null) => {
    if (key) {
      setSelectedValues(section.name, { [key]: value });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <InputNumber
        placeholder={`Enter ${section.label}`}
        onChange={handleChange}
        value={selected}
        disabled={isDisabled}
        min={1}
        max={36}
        style={{ width: '100%', maxWidth: '20rem', backgroundColor: '#fff' }}
      />
    </div>
  );
};
