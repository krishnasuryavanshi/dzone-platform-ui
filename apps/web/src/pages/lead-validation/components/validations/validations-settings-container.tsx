import { type FC, useEffect } from 'react';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { ValidationSettingsTabs } from './validation-settings-tabs';

export const ValidationsSettingsContainer: FC = () => {
  const { leadValidationSettingConfig, setActiveRule, getValidationSettingRules } =
    useValidationSettingStore();

  useEffect(() => {
    if (leadValidationSettingConfig) {
      const rules = getValidationSettingRules('Validations');
      if (rules.length > 0) {
        setActiveRule(rules[0].name);
      }
    }
  }, [leadValidationSettingConfig]);

  return <ValidationSettingsTabs />;
};
