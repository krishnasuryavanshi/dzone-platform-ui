import { type FC } from 'react';
import { Button, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { usePermissionCheck } from '@dzone/shared-auth';
import { UserActionsEnum } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';
import type { IUser } from '../lib/types';

interface IUserActionsProps {
  record: IUser;
  onToggleStatus: (user: IUser) => void;
  onResendLink: (user: IUser) => void;
}

const ACTION_MAP: Record<string, string[]> = {
  Invited: ['resend'],
  Active: ['toggle', 'resend', 'edit'],
  Deactivated: ['toggle', 'resend', 'edit'],
};

export const UserActions: FC<IUserActionsProps> = ({
  record,
  onToggleStatus,
  onResendLink,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canUpdate = usePermissionCheck(UserActionsEnum.Update);
  const canEdit = usePermissionCheck(UserActionsEnum.Edit);

  const statusLabel =
    record.status === 'Deactivated' ? 'Activate User' : 'Deactivate User';
  const allowed = ACTION_MAP[record.status] ?? [];

  const items = [
    canUpdate &&
      allowed.includes('toggle') && {
        key: 'toggle',
        label: t(statusLabel),
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          onToggleStatus(record);
        },
      },
    canUpdate &&
      allowed.includes('resend') && {
        key: 'resend',
        label: t('Send password reset link'),
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          onResendLink(record);
        },
      },
    canEdit &&
      allowed.includes('edit') && {
        key: 'edit',
        label: t('Edit Details'),
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          navigate(`/ums/users/${record.id}`);
        },
      },
  ].filter(Boolean);

  return (
    <Dropdown
      menu={{ items: items as any }}
      placement="bottomLeft"
      trigger={['click']}
      disabled={!record.editable}
    >
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<MoreOutlined />}
        type="text"
      />
    </Dropdown>
  );
};
