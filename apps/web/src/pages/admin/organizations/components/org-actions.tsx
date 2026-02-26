import { type FC } from 'react';
import { Button, Dropdown } from 'antd';
import { ThreeDotsActionsIcon } from '@dzone/shared-ui';
import { useNavigate } from 'react-router';
import { usePermissionCheck } from '@dzone/shared-auth';
import { UserActionsEnum } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';
import type { IOrganization } from '../lib/types';

interface IOrgActionsProps {
  record: IOrganization;
  onToggleStatus: (org: IOrganization) => void;
}

export const OrgActions: FC<IOrgActionsProps> = ({
  record,
  onToggleStatus,
}) => {
  const navigate = useNavigate();
  const canViewUsers = usePermissionCheck(UserActionsEnum.View);
  const { t } = useTranslation();
  const status = record.status?.name;
  const statusLabel =
    status === 'INACTIVE'
      ? 'Activate Organization'
      : 'Deactivate Organization';

  const items = [
    {
      key: 'toggle-status',
      label: t(statusLabel),
      onClick: (e: any) => {
        e.domEvent?.stopPropagation();
        onToggleStatus(record);
      },
    },
    canViewUsers && {
      key: 'view-users',
      label: t('View Users'),
      onClick: (e: any) => {
        e.domEvent?.stopPropagation();
        navigate(
          `/ums/users?org=${record.id}&orgName=${encodeURIComponent(record.name)}`,
        );
      },
    },
    {
      key: 'edit',
      label: t('Edit Details'),
      onClick: (e: any) => {
        e.domEvent?.stopPropagation();
        navigate(`/organizations/${record.id}`);
      },
    },
  ].filter(Boolean);

  return (
    <Dropdown menu={{ items: items as any }} placement="bottomLeft">
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type="text"
        className="icon-only-button"
      />
    </Dropdown>
  );
};
