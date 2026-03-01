import { type FC, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { TargetingSection } from './targeting-section';

export const TargetingSections: FC = () => {
  const [sections, setSections] = useState<Record<string, any>[]>([]);
  const { getValidationSettingRuleSections, activeRule } = useValidationSettingStore();

  useEffect(() => {
    if (activeRule) {
      setSections(getValidationSettingRuleSections());
    } else {
      setSections([]);
    }
  }, [activeRule]);

  const renderSection = (section: Record<string, any>) => (
    <TargetingSection name={section.name} key={section.name} />
  );

  return (
    <div style={{ maxHeight: 'calc(100vh - 20rem)', overflowY: 'auto' }}>
      <Flex vertical gap="1rem">
        <MapFunction items={sections} renderItem={renderSection} />
      </Flex>
    </div>
  );
};
