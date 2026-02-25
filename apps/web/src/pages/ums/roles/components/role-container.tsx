import { useEffect } from 'react';
import { Flex, Typography, Pagination, Button, notification } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQueryState } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { RoleActionsEnum } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { useRoles, useUpdateRoleStatus } from '../hooks';
import { RoleList } from './role-list';
import { RoleStatus } from '../lib/types';
import type { IRoles } from '../lib/types';

const { Text } = Typography;
const DEFAULT_PAGE_SIZE = 25;

export const RoleContainer = () => {
  const { queryState, setQueryState } = useQueryState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canCreate = usePermissionCheck(RoleActionsEnum.Create);

  const pageNo = Number(queryState.page) || 1;
  const pageSize = Number(queryState.pageSize) || DEFAULT_PAGE_SIZE;

  useEffect(() => {
    if (!queryState.page || !queryState.pageSize) {
      setQueryState([
        { name: 'page', value: pageNo },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  }, []);

  const { data } = useRoles(pageNo - 1, pageSize);
  const updateStatusMutation = useUpdateRoleStatus();

  const roles: IRoles[] = (data?.data ?? []).map((r: IRoles) => ({
    ...r,
    key: r.id,
  }));
  const totalRecords: number = data?.total ?? 0;

  const handlePageChange = (page: number, size: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: size },
    ]);
  };

  const handleToggleStatus = (record: IRoles) => {
    const newStatus =
      record.status?.name === RoleStatus.ACTIVE
        ? RoleStatus.INACTIVE
        : RoleStatus.ACTIVE;
    updateStatusMutation.mutate(
      { roleId: record.id, status: newStatus },
      {
        onSuccess: () =>
          notification.success({ message: t('Role status updated') }),
        onError: () =>
          notification.error({ message: t('Failed to update role status') }),
      },
    );
  };

  return (
    <Flex vertical gap="1rem" style={{ height: '100%' }}>
      <Flex justify="space-between" align="center">
        <Text strong>{t('Roles & Permissions')}</Text>
        <Hideable show={canCreate}>
          <Button type="primary" onClick={() => navigate('/ums/roles/create')}>
            {t('Create New Role')}
          </Button>
        </Hideable>
      </Flex>
      <Flex vertical style={{ flex: 1 }}>
        <RoleList roles={roles} onToggleStatus={handleToggleStatus} />
      </Flex>
      <Hideable show={totalRecords > 0}>
        <Flex justify="end">
          <Pagination
            current={pageNo}
            pageSize={pageSize}
            total={totalRecords}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total) => `Total ${total} items`}
          />
        </Flex>
      </Hideable>
    </Flex>
  );
};
