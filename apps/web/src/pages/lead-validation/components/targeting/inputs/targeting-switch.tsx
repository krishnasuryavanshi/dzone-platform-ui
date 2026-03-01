import { type FC, useEffect, useState } from 'react';
import { Flex, Switch, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Hideable } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { SuppressionInclusion } from './suppression-inclusion';
import { ChipsInclusion } from './chips-inclusion';
import { Chips } from './chips';
import { DropdownCustom } from './dropdown-custom';
import { DropdownSearch } from './dropdown-search';

const { Text } = Typography;

interface Props {
  sectionName: string;
  attribute: Record<string, any>;
}

export const TargetingSwitch: FC<Props> = ({ sectionName, attribute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { targetingSwitchFields, updateTargetingSwitchFields, isReadOnly } =
    useValidationSettingStore();

  const isChecked = targetingSwitchFields[attribute.name] || false;

  useEffect(() => {
    setIsOpen(isChecked);
  }, [targetingSwitchFields, attribute.name]);

  const handleSwitchChange = (checked: boolean) => {
    updateTargetingSwitchFields(attribute.name, checked);
    setIsOpen(checked);
  };

  const handleOpening = () => {
    if (isChecked) setIsOpen(!isOpen);
  };

  const renderInputContents = () => {
    switch (attribute.type) {
      case 'switch_suppression_inclusion':
        return <SuppressionInclusion attribute={attribute} sectionName={sectionName} />;
      case 'switch_chips_inclusion':
        return <ChipsInclusion attribute={attribute} sectionName={sectionName} />;
      case 'switch_chips':
        return <Chips attribute={attribute} sectionName={sectionName} />;
      case 'switch_dropdown_custom':
        return <DropdownCustom attribute={attribute} sectionName={sectionName} />;
      case 'switch_dropdown_searchable':
        return <DropdownSearch attribute={attribute} sectionName={sectionName} />;
      default:
        return null;
    }
  };

  return (
    <Flex vertical gap="0.5rem">
      <Flex
        justify="space-between"
        align="center"
        style={{ padding: '1.25rem 1.5rem' }}>
        <Flex gap="0.75rem" align="center">
          <Switch onChange={handleSwitchChange} checked={isChecked} disabled={isReadOnly} />
          <Text>{attribute.label}</Text>
        </Flex>
        <div
          onClick={handleOpening}
          style={{
            cursor: isChecked ? 'pointer' : 'not-allowed',
            opacity: isChecked ? 1 : 0.5,
          }}>
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </div>
      </Flex>
      <Hideable show={isOpen}>
        <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid #E5EBF1' }}>
          {renderInputContents()}
        </div>
      </Hideable>
    </Flex>
  );
};
