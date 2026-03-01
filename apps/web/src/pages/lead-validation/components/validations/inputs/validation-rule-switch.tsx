import { type FC, useEffect, useState } from 'react';
import { Switch, Flex, Typography } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { FieldAdditionalContent } from '../../shared/field-additional-content';

const { Text } = Typography;

interface Props {
  section: Record<string, any>;
  isDisabled: boolean;
}

export const ValidationRuleSwitch: FC<Props> = ({ section, isDisabled }) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected({ ...(selectedValues[section.name] || {}) });
  }, [selectedValues, section]);

  const handleChange = (name: string, isChecked: boolean) => {
    setSelectedValues(section.name, { ...selected, [name]: isChecked });
  };

  const renderSwitch = (item: Record<string, any>, index: number) => {
    const isLast = index === section.attributes.length - 1;
    return (
      <div style={{ padding: '1rem', borderBottom: isLast ? 'none' : '1px solid #EAF1FF' }} key={index}>
        <Flex gap="1rem">
          <Switch
            onChange={(isChecked) => handleChange(item.name, isChecked)}
            checked={selected[item.name] || false}
            disabled={isDisabled}
          />
          <Flex vertical gap="0.5rem">
            <Text style={{ marginLeft: '0.5rem', color: '#333' }}>{item.label}</Text>
            {item.config && <FieldAdditionalContent config={item.config} />}
          </Flex>
        </Flex>
      </div>
    );
  };

  return <MapFunction items={section.attributes} renderItem={renderSwitch} />;
};
