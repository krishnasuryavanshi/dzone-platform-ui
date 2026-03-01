import { type FC } from 'react';
import { Flex } from 'antd';
import { CreateValidationSettingHeader } from './create-validation-setting-header';
import { ValidationSettingTabsContainer } from './validation-setting-tabs-container';

interface Props {
  isEditing: boolean;
  tenantCode?: string;
  leadValidationSettingId?: string;
  lineItemId?: string;
}

export const CreateValidationSettingContainer: FC<Props> = ({
  isEditing,
  tenantCode,
  lineItemId,
  leadValidationSettingId,
}) => {
  return (
    <div style={{ padding: '1rem' }}>
      <Flex vertical gap="1rem" style={{ height: '100%' }}>
        <CreateValidationSettingHeader isEditing={isEditing} />
        <div style={{ flex: 1 }}>
          <ValidationSettingTabsContainer
            isEditing={isEditing}
            tenantCode={tenantCode}
            lineItemId={lineItemId}
            leadValidationSettingId={leadValidationSettingId}
          />
        </div>
      </Flex>
    </div>
  );
};
