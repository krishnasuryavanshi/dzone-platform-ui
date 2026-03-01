import { useValidationSettingStore } from '../../../../../lead-validation/stores/use-validation-settings-store';
import { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';
import { ShowTargetingAttributesContainer } from './show-targeting-attributes';

type TargetingProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const Targeting = ({ ruleName, isEditing = false }: TargetingProps) => {
  const [header, setHeader] = useState<string>('');
  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
    }
  }, [ruleName, leadValidationSettingConfig]);
  if (!header) {
    return null; // or some fallback UI
  }
  return (
    <RuleContainer header={header} ruleName={ruleName} showEditButton={false}>
      <ShowTargetingAttributesContainer
        targetingRuleDetails={leadValidationSettingConfig?.[ruleName]}
        isEditing={isEditing}
      />
    </RuleContainer>
  );
};
