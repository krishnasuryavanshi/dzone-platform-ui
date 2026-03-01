import { type FC, useEffect, useState } from 'react';
import { Flex, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Hideable } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { TargetingContainer } from '../targeting/targeting-container';
import { ValidationsSettingsContainer } from '../validations/validations-settings-container';
import { ValidationSettingsActions } from './validation-settings-actions';

interface Props {
  isEditing?: boolean;
  tenantCode?: string;
  lineItemId?: string;
  leadValidationSettingId?: string;
}

export const ValidationSettingTabsContainer: FC<Props> = ({
  isEditing,
  tenantCode,
  lineItemId,
  leadValidationSettingId,
}) => {
  const [activeTab, setActiveTab] = useState<'targeting' | 'validations'>('targeting');

  const {
    setIsEditing,
    setLeadValidationSettingInfo,
    fetchConfiguration,
    leadValidationSettingInfo,
    leadValidationSettingConfig,
  } = useValidationSettingStore();

  useEffect(() => {
    if (isEditing && leadValidationSettingId && tenantCode) {
      setIsEditing(true);
      setLeadValidationSettingInfo({ leadValidationSettingId, tenantCode });
    } else if (isEditing && leadValidationSettingId && lineItemId) {
      setIsEditing(true);
      setLeadValidationSettingInfo({ leadValidationSettingId, lineItemId });
    } else {
      setIsEditing(false);
      setLeadValidationSettingInfo(null);
    }
  }, [isEditing, leadValidationSettingId, tenantCode, lineItemId]);

  useEffect(() => {
    fetchConfiguration();
  }, [leadValidationSettingInfo]);

  const items: TabsProps['items'] = [
    { key: 'targeting', label: 'Targeting' },
    { key: 'validations', label: 'Validations' },
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
        height: '100%',
      }}>
      <div
        style={{
          padding: '2rem',
          paddingTop: '1rem',
          paddingBottom: 0,
          borderBottom: '1px solid #e8e8e8',
        }}>
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={(key) => setActiveTab(key as 'targeting' | 'validations')}
          destroyInactiveTabPane
        />
      </div>
      <div style={{ padding: '1rem 0' }}>
        <Hideable show={activeTab === 'targeting' && !!leadValidationSettingConfig}>
          <TargetingContainer />
        </Hideable>
        <Hideable show={activeTab === 'validations' && !!leadValidationSettingConfig}>
          <ValidationsSettingsContainer />
        </Hideable>
      </div>
      <div style={{ position: 'fixed', bottom: '1rem', padding: '1rem', right: '2rem' }}>
        <Flex justify="flex-end">
          <ValidationSettingsActions />
        </Flex>
      </div>
    </div>
  );
};
