import { type FC, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { ValidationSettingTabItem } from './validation-setting-tab-item';
import { ValidationSettingTabItemContent } from './validation-setting-tab-item-content';

export const ValidationSettingsTabs: FC = () => {
  const [items, setItems] = useState<TabsProps['items']>([]);
  const { getValidationSettingRules, setActiveRule, activeRule, isReadOnly } =
    useValidationSettingStore();

  useEffect(() => {
    const rules = getValidationSettingRules('Validations');
    if (rules.length > 0) {
      setItems(
        rules.map((rule) => ({
          key: rule.name,
          label: (
            <ValidationSettingTabItem
              name={rule.name}
              label={rule.label}
              disabled={isReadOnly}
            />
          ),
          children: <ValidationSettingTabItemContent />,
        })),
      );
    } else {
      setItems([]);
    }
  }, [getValidationSettingRules, isReadOnly]);

  return (
    <div style={{ paddingInline: '0.75rem 2rem' }}>
      <Tabs
        tabPosition="left"
        destroyInactiveTabPane
        items={items}
        onChange={(key) => setActiveRule(key)}
        activeKey={activeRule || undefined}
        style={{ height: '100%' }}
      />
    </div>
  );
};
