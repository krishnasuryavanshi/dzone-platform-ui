import { useValidationSettingStore } from '../../../../lead-validation/stores/use-validation-settings-store';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import { LeadValidationSettingsWrapper } from './lead-validation-settings-wrapper';

type LeadValidationSettingsContainerProps = {
  isEditing?: boolean;
  lineItemId?: string;
  leadValidationSettingId?: string;
};

export const LeadValidationSettingsContainer = ({
  isEditing = false,
  lineItemId,
  leadValidationSettingId,
}: LeadValidationSettingsContainerProps) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const {
    fetchConfiguration,
    setLeadValidationSettingInfo,
    setIsEditing,
    resetAll,
    leadValidationSettingInfo,
    leadValidationSettingConfig,
  } = useValidationSettingStore();

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (lineItemId && leadValidationSettingId) {
      setIsEditing(true);
      setLeadValidationSettingInfo({ lineItemId, leadValidationSettingId });
    } else {
      setIsEditing(false);
      setLeadValidationSettingInfo(null);
    }
  }, [lineItemId, leadValidationSettingId]);

  useEffect(() => {
    if (leadValidationSettingInfo?.lineItemId) {
      fetchConfiguration();
    }
  }, [leadValidationSettingInfo]);

  useEffect(() => {
    if (leadValidationSettingConfig) {
      setIsReady(true);
    }
  }, [leadValidationSettingConfig]);

  if (!isReady) {
    return null;
  }
  return (
    <Flex vertical>
      <LeadValidationSettingsWrapper
        isEditing={isEditing}
        lineItemId={lineItemId}
        leadValidationSettingId={leadValidationSettingId}
      />
    </Flex>
  );
};
