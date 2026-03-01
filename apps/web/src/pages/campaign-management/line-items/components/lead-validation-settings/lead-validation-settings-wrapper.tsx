import { notification, Button, Flex } from 'antd';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { validateLineItem } from '../../services';
import { LeadValidationSettingsRules } from './lead-validation-settings-rules';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';

type LeadValidationSettingsWrapperProps = {
  isEditing?: boolean;
  lineItemId?: string;
  leadValidationSettingId?: string;
};

export const LeadValidationSettingsWrapper = ({
  isEditing = false,
  lineItemId,
  leadValidationSettingId,
}: LeadValidationSettingsWrapperProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const canEditValidationSettings = usePermissionCheck(LineItemActionsEnum.EditValidationSettings);
  const canViewValidationSettings = usePermissionCheck(LineItemActionsEnum.ViewValidationSettings);

  const validateCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const data = await validateLineItem(lineItemId as string);
      if (data?.data) {
        navigateToSettings();
      }
    } catch (error) {
      notification.error({ message: error as string });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSettings = () => {
    const queryParam = isEditing ? 'edit' : 'view';
    navigate(
      `/lead-validation-settings/line-items/${lineItemId}/settings/${leadValidationSettingId}?redirectTo=${queryParam}`,
    );
  };

  return (
    <Flex vertical>
      <Flex justify='end' align='center'>
        {/* Show Edit All button for editing mode */}
        {isEditing && canEditValidationSettings && (
          <Button
            type='link'
            style={{ height: '1.5rem', padding: '0 0.5rem' }}
            loading={isLoading}
            onClick={validateCampaignDetails}>
            Edit All
          </Button>
        )}

        {/* Show View All button for view mode */}
        {!isEditing && canViewValidationSettings && (
          <Button
            type='link'
            style={{ height: '1.5rem', padding: '0 0.5rem' }}
            loading={isLoading}
            onClick={validateCampaignDetails}>
            View All
          </Button>
        )}
      </Flex>
      <Flex vertical>
        <LeadValidationSettingsRules isEditing={isEditing} />
      </Flex>
    </Flex>
  );
};
