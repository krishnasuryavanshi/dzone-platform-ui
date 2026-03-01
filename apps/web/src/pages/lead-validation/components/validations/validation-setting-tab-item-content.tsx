import { type FC, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { ValidationSettingRuleSection } from './validation-setting-rule-section';

export const ValidationSettingTabItemContent: FC = () => {
  const { getValidationSettingRuleSections, activeRule, leadValidationSettingConfig } =
    useValidationSettingStore();
  const [ruleSections, setRuleSections] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (leadValidationSettingConfig && activeRule) {
      setRuleSections(getValidationSettingRuleSections());
    } else {
      setRuleSections([]);
    }
  }, [leadValidationSettingConfig, activeRule]);

  const renderSection = (section: Record<string, any>, index: number) => (
    <ValidationSettingRuleSection
      name={section.name}
      key={index}
      noBorder={section.name === 'LOOPBACK_PERIOD' || section.noBorder}
    />
  );

  return (
    <div style={{ maxHeight: 'calc(100vh - 20rem)', overflowY: 'auto' }}>
      <Row>
        <Col xl={24} xxl={16}>
          <MapFunction items={ruleSections} renderItem={renderSection} />
        </Col>
      </Row>
    </div>
  );
};
