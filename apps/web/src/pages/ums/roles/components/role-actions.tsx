import { type FC } from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import { ThreeDotsActionsIcon } from '@dzone/shared-ui';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePermissionCheck } from '@dzone/shared-auth';
import { RoleActionsEnum } from '@dzone/shared-lib';
import type { IRoles } from '../lib/types';
import { RoleStatus } from '../lib/types';

interface IRoleActionsProps {
  record: IRoles;
  onToggleStatus: (record: IRoles) => void;
}

export const RoleActions: FC<IRoleActionsProps> = ({
  record,
  onToggleStatus,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canEdit = usePermissionCheck(RoleActionsEnum.Edit);
  const canUpdate = usePermissionCheck(RoleActionsEnum.Update);

  const status = record.status?.name;
  const statusLabel =
    status === RoleStatus.INACTIVE ? t('Mark as Active') : t('Mark as Inactive');
  const isMarkAsActiveDisabled =
    record.users > 0 && status === RoleStatus.ACTIVE;

  const items = [
    {
      key: 'view-users',
      label: t('View Users'),
      onClick: (e: any) => {
        e.domEvent?.stopPropagation();
        navigate(`/ums/users?roleId=${record.id}`);
      },
    },
    ...(record.editable && canEdit
      ? [
          {
            key: 'view-permissions',
            label: t('View Permissions'),
            onClick: (e: any) => {
              e.domEvent?.stopPropagation();
              navigate(`/ums/roles/${record.id}`);
            },
          },
        ]
      : []),
    ...(record.editable && canUpdate
      ? [
          {
            key: 'toggle-status',
            label: isMarkAsActiveDisabled ? (
              <Tooltip title={t('Cannot deactivate role with active users')}>
                <span style={{ color: '#bfbfbf', cursor: 'not-allowed' }}>
                  {statusLabel}
                </span>
              </Tooltip>
            ) : (
              statusLabel
            ),
            disabled: isMarkAsActiveDisabled,
            onClick: (e: any) => {
              e.domEvent?.stopPropagation();
              if (!isMarkAsActiveDisabled) onToggleStatus(record);
            },
          },
        ]
      : []),
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type="text"
        className="icon-only-button"
      />
    </Dropdown>
  );
};
