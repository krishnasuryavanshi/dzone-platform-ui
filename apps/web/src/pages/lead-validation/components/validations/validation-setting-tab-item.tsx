import { type FC, useEffect, useState } from 'react';
import { Checkbox, Flex, Typography } from 'antd';
import type { CheckboxProps } from 'antd';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';

const { Text } = Typography;

interface Props {
  name: string;
  label: string;
  disabled: boolean;
}

export const ValidationSettingTabItem: FC<Props> = ({ name, label, disabled }) => {
  const [isActive, setIsActive] = useState(false);
  const { enabledRules, activeRule, updateRuleSelection } = useValidationSettingStore();

  useEffect(() => {
    setIsActive(activeRule === name);
  }, [activeRule, name]);

  const onChange: CheckboxProps['onChange'] = (e) => {
    updateRuleSelection(name, e.target.checked);
  };

  return (
    <Flex>
      <div
        style={{
          borderRadius: isActive ? '4px 0 0 4px' : '4px',
          width: '15rem',
          height: '3rem',
          backgroundColor: isActive ? '#EAF1FF' : '#FAFAFA',
        }}>
        <Flex align="center" style={{ height: '100%' }}>
          <Flex style={{ paddingLeft: '1rem' }} gap="0.5rem">
            <Checkbox
              onChange={onChange}
              checked={enabledRules?.[name] || false}
              disabled={disabled}
            />
            <Text style={{ color: '#235AED' }}>{label}</Text>
          </Flex>
        </Flex>
      </div>
      <div
        style={{
          borderBlock: isActive ? '1.5rem solid transparent' : 'none',
          borderLeft: isActive ? '1.5rem solid #EAF1FF' : 'none',
          height: '0',
          width: '0',
        }}
      />
    </Flex>
  );
};
