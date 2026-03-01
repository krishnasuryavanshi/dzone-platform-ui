import { type FC, useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { SectionAttribute } from './section-attribute';

const { Text } = Typography;

interface Props {
  name: string;
}

export const TargetingSection: FC<Props> = ({ name }) => {
  const [section, setSection] = useState<Record<string, any> | null>(null);
  const { getValidationSettingRuleSection } = useValidationSettingStore();

  useEffect(() => {
    const sectionDetails = getValidationSettingRuleSection(name);
    setSection(sectionDetails && Object.keys(sectionDetails).length > 0 ? sectionDetails : null);
  }, [name]);

  const renderAttribute = (item: Record<string, any>, index: number) => (
    <SectionAttribute sectionName={name} attribute={item} key={index} />
  );

  if (!section) return null;

  return (
    <Flex vertical gap="1rem">
      <Flex
        style={{
          background: '#EAF1FF',
          height: '3rem',
          paddingInline: '1rem',
          marginInline: '0.25rem',
        }}
        align="center">
        <Text strong>{section.description}</Text>
      </Flex>
      <Flex vertical gap="0.5rem" style={{ paddingInline: '1.75rem' }}>
        <MapFunction items={section.attributes} renderItem={renderAttribute} />
      </Flex>
    </Flex>
  );
};
