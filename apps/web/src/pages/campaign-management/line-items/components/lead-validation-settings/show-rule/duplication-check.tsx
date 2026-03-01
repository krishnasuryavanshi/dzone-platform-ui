import { useValidationSettingStore } from '../../../../../lead-validation/stores/use-validation-settings-store';
import { Hideable } from '@dzone/shared-ui';
import { Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';

const { Text } = Typography;

type DuplicationCheckProps = {
  ruleName: string;
  isEditing?: boolean;
};

// Specific configuration for the duplication editor
const duplicationEditConfig = {
  type: 'duplication',
};

export const DuplicationCheck = ({
  ruleName,
  isEditing,
}: DuplicationCheckProps) => {
  const [header, setHeader] = useState<string>('');
  const [extra, setExtra] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [lookbackPeriod, setLookbackPeriod] = useState<string>('');

  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const sectionValues: Record<string, any> = {};

      res?.sections?.forEach((section: Record<string, any>) => {
        if (section.attributes?.[0]?.type === 'number') {
          sectionValues[section.name] = section.attributes?.[0]?.value;
          return;
        }
        const values =
          section.attributes
            ?.filter((attr: Record<string, any>) => attr.value)
            ?.map((attr: Record<string, any>) => attr.label || '') || [];
        sectionValues[section.name] = values;
      });

      const extra: string[] = [];

      Object.entries(sectionValues).forEach(([key, value]) => {
        if (key === 'LOOPBACK_PERIOD') {
          setLookbackPeriod(value);
        } else if (key === 'ACCOUNT_LEVEL' || key === 'ENTITY_LEVEL') {
          extra.push(...value);
        } else if (key === 'DUPLICATE_VALIDATION_FIELDS') {
          setFields(value);
        }
      });

      setExtra(extra);
    }
  }, [ruleName, leadValidationSettingConfig]);

  return (
    <RuleContainer
      header={header}
      extra={extra}
      ruleName={ruleName}
      editConfig={duplicationEditConfig}
      showEditButton={isEditing}>
      <Hideable show={fields.length > 0 || !!lookbackPeriod}>
        <Flex gap='2rem'>
          <Hideable show={!!lookbackPeriod}>
            <Flex>
              <Text strong style={{ fontSize: '0.875rem' }}>
                Look Back Period (in months) :{' '}
              </Text>
              <Text style={{ fontSize: '0.875rem' }}>{lookbackPeriod}</Text>
            </Flex>
          </Hideable>
          <Hideable show={fields.length > 0}>
            <Flex>
              <Text strong style={{ fontSize: '0.875rem' }}>
                Fields :{' '}
              </Text>
              <Text style={{ fontSize: '0.875rem' }}>{fields.join(', ')}</Text>
            </Flex>
          </Hideable>
        </Flex>
      </Hideable>
    </RuleContainer>
  );
};
