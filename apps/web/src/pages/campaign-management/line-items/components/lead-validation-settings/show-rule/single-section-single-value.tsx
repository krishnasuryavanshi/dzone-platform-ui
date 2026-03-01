import { useValidationSettingStore } from '../../../../../lead-validation/stores/use-validation-settings-store';
import { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';

type SingleSectionSingleValueProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const SingleSectionSingleValue = ({
  ruleName,
  isEditing,
}: SingleSectionSingleValueProps) => {
  const [header, setHeader] = useState<string>('');
  const [extra, setExtra] = useState<string[]>([]);
  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const extras = res?.sections?.[0]?.attributes
        ?.filter((attr: Record<string, any>) => attr.value)
        ?.map((attr: Record<string, any>) => attr.label || '');
      setExtra(extras || []);
    }
  }, [ruleName, leadValidationSettingConfig]);
  return (
    <RuleContainer
      header={header}
      extra={extra}
      ruleName={ruleName}
      showEditButton={isEditing}>
      {/* <Flex>
        <Text strong>Fields : </Text>
        <Text>Email, Phone Number</Text>
      </Flex> */}
    </RuleContainer>
  );
};
