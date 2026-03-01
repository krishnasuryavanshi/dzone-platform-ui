import { type FC, useEffect, useState } from 'react';
import { Checkbox, Flex, Typography } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { FieldAdditionalContent } from '../../shared/field-additional-content';

const { Text } = Typography;

interface Props {
  section: Record<string, any>;
  isDisabled: boolean;
}

export const ValidationRuleCheckboxGroup: FC<Props> = ({ section, isDisabled }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected(Object.keys(selectedValues[section.name] || {}));
  }, [selectedValues, section]);

  const handleChange = (checkedValue: string[]) => {
    const result: Record<string, boolean> = {};
    const isDuplicationEntityLevel = section.name === 'ENTITY_LEVEL';

    checkedValue.forEach((v) => { result[v] = true; });

    if (isDuplicationEntityLevel && result['Campaign'] && !result['lineItem']) {
      result['lineItem'] = true;
    }

    setSelectedValues(section.name, result);
  };

  const renderCheckbox = (item: Record<string, any>, index: number) => {
    const isLast = index === section.attributes.length - 1;
    return (
      <div style={{ padding: '1rem', borderBottom: isLast ? 'none' : '1px solid #EAF1FF' }} key={index}>
        <Checkbox value={item.name}>
          <Flex vertical gap="1rem">
            <Text style={{ marginLeft: '0.5rem' }} strong>{item.label}</Text>
            {item.config && <FieldAdditionalContent config={item.config} />}
          </Flex>
        </Checkbox>
      </div>
    );
  };

  return (
    <Checkbox.Group
      value={selected}
      disabled={isDisabled}
      onChange={handleChange as any}
      style={{ display: 'flex', flexDirection: 'column' }}>
      <MapFunction items={section.attributes} renderItem={renderCheckbox} />
    </Checkbox.Group>
  );
};
