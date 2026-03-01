import { type FC, useEffect } from 'react';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { TargetingSections } from './targeting-sections';

export const TargetingContainer: FC = () => {
  const { leadValidationSettingConfig, activeRule, setActiveRule, getValidationSettingRules } =
    useValidationSettingStore();

  useEffect(() => {
    if (leadValidationSettingConfig) {
      const rules = getValidationSettingRules('Targeting');
      if (rules.length > 0) {
        setActiveRule(rules[0].name);
      }
    }
  }, [leadValidationSettingConfig]);

  if (!activeRule) return null;

  return <TargetingSections />;
};
