import { useValidationSettingStore } from '../../../../../lead-validation/stores/use-validation-settings-store';
import { Hideable } from '@dzone/shared-ui';
import { Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';

const { Text } = Typography;

type SyntaxValidationProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const SyntaxValidation = ({
  ruleName,
  isEditing = false,
}: SyntaxValidationProps) => {
  const [header, setHeader] = useState<string>('');
  const [fields, setFields] = useState<string[]>([]);

  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const fields =
        res?.sections?.[0]?.attributes
          ?.filter((attr: Record<string, any>) => attr.value)
          ?.map((attr: Record<string, any>) => attr.label || '') || [];
      setFields(fields);
    }
  }, [ruleName, leadValidationSettingConfig]);
  return (
    <RuleContainer
      header={header}
      ruleName={ruleName}
      showEditButton={isEditing}>
      <Hideable show={fields.length > 0}>
        <Flex>
          <Text style={{ fontSize: '0.875rem' }} strong>
            Fields :{' '}
          </Text>
          <Text style={{ fontSize: '0.875rem' }}>{fields.join(', ')}</Text>
        </Flex>
      </Hideable>
    </RuleContainer>
  );
};
