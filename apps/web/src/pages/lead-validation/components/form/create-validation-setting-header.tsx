import { type FC } from 'react';
import { Flex } from 'antd';
import { ValidationSettingsTitle } from './validation-settings-title';
import { ValidationSettingsBackNavigation } from './validation-settings-back-navigation';

interface Props {
  isEditing: boolean;
}

export const CreateValidationSettingHeader: FC<Props> = ({ isEditing }) => {
  return (
    <Flex gap="0.75rem" vertical>
      <ValidationSettingsTitle />
      <ValidationSettingsBackNavigation isEditing={isEditing} />
    </Flex>
  );
};
