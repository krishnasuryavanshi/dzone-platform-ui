import { type FC, useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import {
  ValidationRuleCheckboxGroup,
  ValidationRuleDropdown,
  ValidationRuleNumberInput,
  ValidationRuleRadioGroup,
  ValidationRuleSwitch,
} from './inputs';

interface Props {
  section: Record<string, any>;
}

export const ValidationSettingRuleSectionInput: FC<Props> = ({ section }) => {
  const { activeRule, enabledRules, isReadOnly } = useValidationSettingStore();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!isReadOnly && enabledRules?.[activeRule as string]) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [activeRule, enabledRules, isReadOnly]);

  switch (section.attributes[0].type) {
    case 'radio':
      return <ValidationRuleRadioGroup section={section} isDisabled={isDisabled} />;
    case 'select':
      return <ValidationRuleDropdown section={section} isDisabled={isDisabled} />;
    case 'number':
      return <ValidationRuleNumberInput section={section} isDisabled={isDisabled} />;
    case 'checkbox':
      return <ValidationRuleCheckboxGroup section={section} isDisabled={isDisabled} />;
    case 'switch':
      return <ValidationRuleSwitch section={section} isDisabled={isDisabled} />;
    default:
      return null;
  }
};
