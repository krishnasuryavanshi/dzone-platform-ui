import { useValidationSettingStore } from '../../../../lead-validation/stores/use-validation-settings-store';
import { MapFunction } from '@dzone/shared-ui';
import { Flex, Typography } from 'antd';
import { LeadValidationSettingRuleContainer } from './lead-validation-setting-rule-container';

const { Text } = Typography;

type LeadValidationSettingsRulesProps = {
  isEditing?: boolean;
};

export const LeadValidationSettingsRules = ({
  isEditing,
}: LeadValidationSettingsRulesProps) => {
  const { leadValidationSettingConfig } = useValidationSettingStore();

  const renderValidationRule = (rule: string) => {
    return (
      <Flex
        vertical
        key={rule}
        style={{
          boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset',
          marginBlock: '0.5rem',
          borderRadius: '8px',
        }}>
        <LeadValidationSettingRuleContainer
          ruleName={rule}
          isEditing={isEditing}
        />
      </Flex>
    );
  };

  if (!leadValidationSettingConfig) {
    return null;
  }

  // Define targeting and validation rules
  const targetingRules = ['TARGETING'];
  const validationRules = [
    'MANDATORY_VALIDATION',
    'DUPLICATE_VALIDATION',
    'SYNTAX_VALIDATION',
    'OPT_IN_VERIFICATION',
    'LOOKBACK_PERIOD',
    'EMAIL_VALIDATION',
  ];

  const allRules = Object.keys(leadValidationSettingConfig) || [];

  const hasEnabledTargetingAttributes =
    leadValidationSettingConfig.TARGETING?.sections?.some((section: any) =>
      section.attributes?.some((attribute: any) => {
        const { value } = attribute;
        // Case 1: Value is a simple truthy value (like true, a number, or a non-empty string)
        if (!!value && typeof value !== 'object') {
          return true;
        }

        // Case 2: Value is an array with items
        if (Array.isArray(value) && value.length > 0) {
          return true;
        }

        // Case 3: Value is an object with type and non-empty data array (as you suggested)
        if (
          value &&
          value.type &&
          Array.isArray(value.data) &&
          value.data.length > 0
        ) {
          return true;
        }

        return false;
      }),
    );

  const targetingRulesToRender = allRules.filter((rule) =>
    targetingRules.includes(rule),
  );
  const validationRulesToRender = allRules.filter(
    (rule) => validationRules.includes(rule) || !targetingRules.includes(rule),
  );

  return (
    <Flex vertical gap='0.5rem'>
      {/* Targeting Section */}
      {hasEnabledTargetingAttributes && targetingRulesToRender.length > 0 && (
        <Flex vertical>
          <Text
            strong
            style={{
              fontSize: '1rem',
              marginBottom: '0.5rem',
              display: 'block',
            }}>
            Targeting
          </Text>
          <MapFunction
            items={targetingRulesToRender}
            renderItem={renderValidationRule}
          />
        </Flex>
      )}

      {/* Validations Section */}
      {validationRulesToRender.length > 0 && (
        <Flex vertical>
          <Text
            strong
            style={{
              fontSize: '1rem',
              marginBottom: '0.5rem',
              display: 'block',
            }}>
            Validations
          </Text>
          <MapFunction
            items={validationRulesToRender}
            renderItem={renderValidationRule}
          />
        </Flex>
      )}
    </Flex>
  );
};
