import { useState, useEffect } from 'react';
import { Flex, Modal, Typography, Pagination, Button, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQueryState } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { UserActionsEnum } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import {
  useUsers,
  useActivateUser,
  useDeactivateUser,
  useResendPasswordLink,
} from '../hooks';
import { UserList } from './user-list';
import type { IUser } from '../lib/types';

const { Text } = Typography;
const DEFAULT_PAGE_SIZE = 25;

export const UserContainer = () => {
  const { queryState, setQueryState } = useQueryState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  const canCreate = usePermissionCheck(UserActionsEnum.Create);

  const pageNo = Number(queryState.page) || 1;
  const pageSize = Number(queryState.pageSize) || DEFAULT_PAGE_SIZE;
  const roleId = queryState.roleId;
  const org = queryState.org;
  const orgName = queryState.orgName
    ? decodeURIComponent(queryState.orgName)
    : undefined;

  const [usernameFilter] = useState('');

  // Sync query params on first render
  useEffect(() => {
    if (!queryState.page || !queryState.pageSize) {
      setQueryState([
        { name: 'page', value: pageNo },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  }, []);

  const { data } = useUsers(
    pageNo - 1,
    pageSize,
    roleId,
    usernameFilter,
    org,
  );

  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  const resendMutation = useResendPasswordLink();

  const users: IUser[] = (data?.data ?? []).map((u: IUser) => ({
    ...u,
    key: u.id,
    username: u.email,
  }));
  const totalRecords: number = data?.total ?? 0;

  const handlePageChange = (page: number, size: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: size },
    ]);
  };

  const handleToggleStatus = (user: IUser) => {
    if (user.status === 'Deactivated') {
      activateMutation.mutate(user.username, {
        onSuccess: (res) =>
          notification.success({ message: res?.message ?? 'User activated' }),
        onError: () => notification.error({ message: 'Failed to activate user' }),
      });
    } else {
      modal.confirm({
        closable: true,
        title: t('Deactivating the user'),
        icon: <ExclamationCircleOutlined style={{ color: '#E04149' }} />,
        content: (
          <Text>
            {t('Deactivating this user')} (
            <Text style={{ color: '#3D71FB' }}>{user.username}</Text>)
            {t(' will immediately revoke their access and permissions. Proceed?')}
          </Text>
        ),
        okText: t('Deactivate'),
        cancelText: t('Cancel'),
        okButtonProps: { danger: true },
        onOk: () =>
          deactivateMutation.mutate(user.username, {
            onSuccess: (res) =>
              notification.success({
                message: res?.message ?? 'User deactivated',
              }),
            onError: () =>
              notification.error({ message: 'Failed to deactivate user' }),
          }),
      });
    }
  };

  const handleResendLink = (user: IUser) => {
    resendMutation.mutate(user.username, {
      onSuccess: (res) =>
        notification.success({
          message: res?.message ?? 'Password reset link sent',
        }),
      onError: () =>
        notification.error({ message: 'Failed to send password reset link' }),
    });
  };

  return (
    <Flex vertical gap="1rem" style={{ height: '100%' }}>
      <Flex justify="space-between" align="center">
        <Text strong>
          {t('Users')}
          {orgName ? ` - ${orgName}` : ''}
        </Text>
        <Hideable show={canCreate}>
          <Button type="primary" onClick={() => navigate('/ums/users/create')}>
            {t('Invite new user')}
          </Button>
        </Hideable>
      </Flex>
      <Flex vertical style={{ flex: 1 }}>
        <UserList
          users={users}
          onToggleStatus={handleToggleStatus}
          onResendLink={handleResendLink}
          emptyText={
            org ? (
              <Flex justify="center" style={{ marginTop: '1rem' }}>
                <Text type="secondary">
                  {t('No users are mapped to')} {orgName || t('this organization')}
                </Text>
              </Flex>
            ) : undefined
          }
        />
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
      {contextHolder}
    </Flex>
  );
};
