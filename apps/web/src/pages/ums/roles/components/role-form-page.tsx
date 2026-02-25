import { useEffect, useMemo, useCallback } from 'react';
import {
  Form,
  Flex,
  Typography,
  Button,
  Switch,
  Spin,
  notification,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePermissionCheck } from '@dzone/shared-auth';
import { RoleActionsEnum } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { useRole, useCreateRole, useUpdateRole } from '../hooks';
import {
  useEditStore,
  useModulesStore,
  useSelectedActionsStore,
  useSelectedPermissionsStore,
  useOldSelectedStore,
  usePermissionsStore,
} from '../stores';
import { BasicDetailsForm } from './basic-details-form';
import { ModulesContainer } from './modules-container';
import type { IRoleDetails, IRolePermissions, IModuleAttributes } from '../lib/types';

const { Text } = Typography;

export default function RoleFormPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isEditing = !!roleId;

  const canEdit = usePermissionCheck(RoleActionsEnum.Edit);

  const { data: roleData, isLoading } = useRole(roleId);
  const roleDetails: IRoleDetails | undefined = roleData?.data ?? roleData;

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const { isEditAllowed, setIsEditing, setIsEditAllowed } = useEditStore();
  const { setBulkSelectedActions, getAllSelectedActions, resetSelectedActions } =
    useSelectedActionsStore();
  const {
    setBulkSelectedPermissions,
    getAllSelectedPermissions,
    resetSelectedPermissions,
  } = useSelectedPermissionsStore();
  const {
    oldSelectedPermissions,
    oldSelectedActions,
    setOldSelectedPermissions,
    setOldSelectedActions,
    resetOldSelectedStores,
  } = useOldSelectedStore();
  const { resetModules } = useModulesStore();
  const { resetPermissions } = usePermissionsStore();

  // Initialize editing state from fetched role
  useEffect(() => {
    if (!isEditing || !roleDetails) return;

    setIsEditing(true);
    setIsEditAllowed(false);

    form.setFieldsValue({
      name: roleDetails.name,
      description: roleDetails.description,
      status: roleDetails.status?.name,
      tenantType: roleDetails.tenantType,
    });

    // Build selected actions and permissions from moduleAttributes
    const actionsMap: Record<string, string[]> = {};
    const permissionsMap: Record<string, string[]> = {};

    (roleDetails.moduleAttributes || []).forEach(
      (attr: IModuleAttributes) => {
        const moduleId = attr.moduleId;
        const actionId = attr.actionId;

        if (!actionsMap[moduleId]) actionsMap[moduleId] = [];
        actionsMap[moduleId].push(actionId);

        const permIds = (attr.attributes || []).map((a) => a.id);
        permissionsMap[actionId] = permIds;
      },
    );

    setBulkSelectedActions(actionsMap);
    setBulkSelectedPermissions(permissionsMap);

    // Store originals for dirty check
    setOldSelectedActions(Object.values(actionsMap).flat());
    setOldSelectedPermissions(Object.values(permissionsMap).flat());
  }, [roleDetails, isEditing]);

  // Cleanup stores on unmount
  useEffect(() => {
    return () => {
      setIsEditing(false);
      setIsEditAllowed(false);
      resetSelectedActions();
      resetSelectedPermissions();
      resetOldSelectedStores();
      resetModules();
      resetPermissions();
    };
  }, []);

  const isDirty = useMemo(() => {
    const currentActions = getAllSelectedActions().sort().join(',');
    const currentPermissions = getAllSelectedPermissions().sort().join(',');
    const origActions = [...oldSelectedActions].sort().join(',');
    const origPermissions = [...oldSelectedPermissions].sort().join(',');
    return currentActions !== origActions || currentPermissions !== origPermissions;
  }, [
    getAllSelectedActions,
    getAllSelectedPermissions,
    oldSelectedActions,
    oldSelectedPermissions,
  ]);

  const isSaveDisabled = useMemo(() => {
    if (isEditing) return !isDirty && !form.isFieldsTouched();
    return false;
  }, [isDirty, isEditing]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const allPermissions = getAllSelectedPermissions();

      const payload: IRolePermissions = {
        name: values.name,
        description: values.description || null,
        status: values.status || 'ACTIVE',
        selected: allPermissions,
        deselected: null,
        tenantType: values.tenantType,
      };

      if (isEditing && roleId) {
        updateMutation.mutate(
          { roleId, payload },
          {
            onSuccess: (res) => {
              notification.success({
                message: res?.message ?? t('Role updated successfully'),
              });
              navigate('/ums/roles');
            },
            onError: () =>
              notification.error({ message: t('Failed to update role') }),
          },
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: (res) => {
            notification.success({
              message: res?.message ?? t('Role created successfully'),
            });
            navigate('/ums/roles');
          },
          onError: () =>
            notification.error({ message: t('Failed to create role') }),
        });
      }
    } catch {
      // validation failed
    }
  }, [form, isEditing, roleId, getAllSelectedPermissions]);

  if (isEditing && isLoading) {
    return (
      <Flex justify="center" align="center" style={{ padding: '2rem' }}>
        <Spin />
      </Flex>
    );
  }

  if (isEditing && !roleDetails) {
    return (
      <Flex justify="center" style={{ padding: '2rem' }}>
        <Text type="secondary">{t('Role not found')}</Text>
      </Flex>
    );
  }

  return (
    <Flex vertical gap="1rem" style={{ height: '100%' }}>
      <Flex justify="space-between" align="center">
        <Flex gap="0.75rem" align="center">
          <ArrowLeftOutlined
            onClick={() => navigate('/ums/roles')}
            style={{ cursor: 'pointer' }}
          />
          <Text strong>
            {isEditing ? t('Edit Role') : t('Create New Role')}
          </Text>
        </Flex>
        <Hideable show={isEditing && canEdit}>
          <Flex gap="0.5rem" align="center">
            <Text strong>{t('Edit Mode')}</Text>
            <Switch
              checked={isEditAllowed}
              onChange={() => setIsEditAllowed(!isEditAllowed)}
              size="small"
            />
          </Flex>
        </Hideable>
      </Flex>

      <Flex
        vertical
        gap="1rem"
        style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}
      >
        <Form form={form} layout="vertical">
          <Flex vertical gap="1rem">
            <BasicDetailsForm form={form} roleDetails={roleDetails} />
            <ModulesContainer roleDetails={roleDetails} />
          </Flex>
        </Form>
      </Flex>

      <Flex justify="end" gap="1rem" style={{ padding: '0 1rem 1rem' }}>
        <Button onClick={() => navigate('/ums/roles')}>{t('Cancel')}</Button>
        <Hideable show={!isEditing || isEditAllowed}>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isSaving}
            disabled={isSaveDisabled}
          >
            {t('Save')}
          </Button>
        </Hideable>
      </Flex>
    </Flex>
  );
}
