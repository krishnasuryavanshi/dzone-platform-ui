import { type FC, useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { ValidationSettingRuleSectionInput } from './validation-setting-rule-section-input';

const { Text } = Typography;

interface Props {
  name?: string;
  noBorder?: boolean;
}

export const ValidationSettingRuleSection: FC<Props> = ({ name, noBorder = false }) => {
  const [section, setSection] = useState<Record<string, any> | null>(null);
  const { leadValidationSettingConfig, activeRule, getValidationSettingRuleSection } =
    useValidationSettingStore();

  useEffect(() => {
    if (!leadValidationSettingConfig || !activeRule || !name) {
      setSection(null);
      return;
    }
    const s = getValidationSettingRuleSection(name);
    if (!s || Object.keys(s).length === 0) {
      setSection(null);
      return;
    }
    setSection(s);
  }, [leadValidationSettingConfig, activeRule, name]);

  if (!section) return null;

  return (
    <Flex vertical gap="0.75rem" style={{ marginBottom: '3rem' }}>
      <div>
        <Text style={{ color: '#95989A', fontWeight: 700 }}>
          {section.description}
        </Text>
      </div>
      <div
        style={
          noBorder
            ? {}
            : { borderRadius: '5px', border: '1px solid #EAF1FF' }
        }>
        <ValidationSettingRuleSectionInput section={section} />
      </div>
    </Flex>
  );
};
