import { type FC } from 'react';
import { Button, Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { usePermissionCheck } from '@dzone/shared-auth';
import { UserActionsEnum } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { useTranslation } from 'react-i18next';

interface IUserFormActionsProps {
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  isReadOnly?: boolean;
}

export const UserFormActions: FC<IUserFormActionsProps> = ({
  onCancel,
  isEditing,
  isSubmitting,
  isReadOnly,
}) => {
  const { t } = useTranslation();
  const canEdit = usePermissionCheck(UserActionsEnum.Edit);
  const canCreate = usePermissionCheck(UserActionsEnum.Create);

  const showSubmit =
    (isEditing && canEdit && !isReadOnly) || (!isEditing && canCreate);

  return (
    <Flex gap="1rem" justify="end">
      <Button onClick={onCancel}>{t('Cancel')}</Button>
      <Hideable show={showSubmit}>
        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingOutlined />
          ) : isEditing ? (
            t('Save')
          ) : (
            t('Save and Invite user')
          )}
        </Button>
      </Hideable>
    </Flex>
  );
};
