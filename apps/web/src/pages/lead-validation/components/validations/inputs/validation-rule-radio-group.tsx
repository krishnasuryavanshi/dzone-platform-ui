import { type FC, useEffect, useState } from 'react';
import { Radio, Flex, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { FieldAdditionalContent } from '../../shared/field-additional-content';

const { Text } = Typography;

interface Props {
  section: Record<string, any>;
  isDisabled: boolean;
}

export const ValidationRuleRadioGroup: FC<Props> = ({ section, isDisabled }) => {
  const [selected, setSelected] = useState('');
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected(Object.keys(selectedValues[section.name] || {})?.[0] || '');
  }, [selectedValues, section]);

  const handleChange = (e: RadioChangeEvent) => {
    setSelectedValues(section.name, { [e.target.value]: true });
  };

  const renderRadio = (item: Record<string, any>, index: number) => {
    const isLast = index === section.attributes.length - 1;
    return (
      <div style={{ padding: '1rem', borderBottom: isLast ? 'none' : '1px solid #EAF1FF' }} key={index}>
        <Radio value={item.name}>
          <Flex vertical gap="1rem">
            <div>
              <Text style={{ marginLeft: '0.5rem' }} strong>{item.label}</Text>
            </div>
            {item.config && <FieldAdditionalContent config={item.config} />}
          </Flex>
        </Radio>
      </div>
    );
  };

  return (
    <Radio.Group
      disabled={isDisabled}
      value={selected}
      onChange={handleChange}
      style={{ display: 'flex', flexDirection: 'column' }}>
      <MapFunction items={section.attributes} renderItem={renderRadio} />
    </Radio.Group>
  );
};
