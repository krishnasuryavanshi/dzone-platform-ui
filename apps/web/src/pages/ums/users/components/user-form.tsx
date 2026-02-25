import { type FC, useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Row,
  Col,
  Flex,
  Typography,
  Modal,
  Divider,
  notification,
} from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Hideable, MapFunction } from '@dzone/shared-ui';
import { useOrganizationsByType, useOrganizationTypes } from '../../../admin/organizations/hooks';
import { useRolesByType, useCreateUser, useUpdateUser } from '../hooks';
import { TenantTypeEnum } from '../lib/types';
import type { IUser, IUserRole } from '../lib/types';
import type { IOrganization } from '../../../admin/organizations/lib/types';
import { UserFormActions } from './user-form-actions';

const { Text, Title } = Typography;

interface IUserFormProps {
  isEditing?: boolean;
  user?: IUser;
}

export const UserForm: FC<IUserFormProps> = ({ isEditing, user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [tenantType, setTenantType] = useState<string>(user?.type ?? '');
  const [isDzoneUser, setIsDzoneUser] = useState(user?.isDzoneUser ?? false);
  const [assignAllManagedOrgs, setAssignAllManagedOrgs] = useState(
    user?.autoAssignMarketers ?? false,
  );
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [createdEmail, setCreatedEmail] = useState('');

  const isMarketer = tenantType === TenantTypeEnum.MARKETER;

  const { data: orgTypesData } = useOrganizationTypes();
  const { data: orgsData } = useOrganizationsByType(tenantType || undefined);
  const { data: rolesData } = useRolesByType(tenantType || undefined);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const orgTypes = orgTypesData ?? [];
  const rawOrganizations: IOrganization[] = orgsData?.data ?? orgsData ?? [];
  const roles = (rolesData?.data ?? rolesData ?? []).map((r: IUserRole) => ({
    label: r.name,
    value: r.id,
  }));

  const organizationsList = rawOrganizations.map((org) => ({
    label: org.name,
    value: org.id!,
    managedByDigitalzone: org.managedByDigitalzone,
  }));

  const managedOrgIds = useMemo(
    () =>
      rawOrganizations
        .filter((org) => org.managedByDigitalzone)
        .map((org) => org.id!)
        .filter(Boolean),
    [rawOrganizations],
  );

  // Populate form fields when editing
  useEffect(() => {
    if (!isEditing || !user) return;

    let orgIds = user.organizations
      .map((org) => org.id)
      .filter((id): id is string => !!id);
    const managedIds = user.organizations
      .filter((org) => org.managedByDigitalzone)
      .map((org) => org.id)
      .filter((id): id is string => !!id);
    orgIds = Array.from(new Set([...orgIds, ...managedIds]));

    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type,
      isDzoneUser: user.isDzoneUser,
      organizations: orgIds,
      roles: user.roles.map((role) => role.id),
      autoAssignMarketers: user.autoAssignMarketers,
    });

    setTenantType(user.type);
    setIsDzoneUser(user.isDzoneUser);
    setAssignAllManagedOrgs(user.autoAssignMarketers);
  }, [user, isEditing]);

  const onValuesChange = (changed: Record<string, any>) => {
    if (changed.type) {
      form.setFieldValue('roles', []);
      form.setFieldValue('organizations', []);
      setTenantType(changed.type);
      if (changed.type === TenantTypeEnum.SUPPLIER) {
        setIsDzoneUser(false);
        form.setFieldValue('isDzoneUser', false);
      }
    }
    if (changed.isDzoneUser !== undefined) {
      setIsDzoneUser(changed.isDzoneUser);
      if (!changed.isDzoneUser) {
        form.setFieldValue('organizations', []);
        setAssignAllManagedOrgs(false);
      }
    }
  };

  const handleAssignAllManagedOrgsChange = (checked: boolean) => {
    setAssignAllManagedOrgs(checked);
    const currentOrgs: string[] = form.getFieldValue('organizations') || [];
    if (checked) {
      form.setFieldValue(
        'organizations',
        Array.from(new Set([...currentOrgs, ...managedOrgIds])),
      );
    } else {
      form.setFieldValue(
        'organizations',
        currentOrgs.filter((id) => !managedOrgIds.includes(id)),
      );
    }
  };

  const handleSelectAllOrgs = () => {
    const currentOrgs: string[] = form.getFieldValue('organizations') || [];
    if (currentOrgs.length === organizationsList.length) {
      if (assignAllManagedOrgs && isDzoneUser) {
        form.setFieldValue('organizations', [...managedOrgIds]);
      } else {
        form.setFieldValue('organizations', []);
      }
    } else {
      form.setFieldValue(
        'organizations',
        organizationsList.map((o) => o.value),
      );
    }
  };

  const onFinish = async (values: Record<string, any>) => {
    if (!Array.isArray(values.organizations)) {
      values.organizations = [values.organizations];
    }
    if (isEditing && user) {
      updateMutation.mutate(
        { payload: values, username: user.email },
        {
          onSuccess: (res) => {
            notification.success({ message: res?.message ?? 'User updated' });
            navigate('/ums/users');
          },
          onError: () =>
            notification.error({ message: 'Failed to update user' }),
        },
      );
    } else {
      createMutation.mutate(
        { ...values, editable: true },
        {
          onSuccess: (res) => {
            if (res?.message) notification.success({ message: res.message });
            setCreatedEmail(values.email);
            setEmailModalOpen(true);
          },
          onError: () =>
            notification.error({ message: 'Failed to create user' }),
        },
      );
    }
  };

  const handleCancel = () => {
    setEmailModalOpen(false);
    navigate('/ums/users');
  };

  const handleFilterOption = (input: string, option: any) =>
    (option?.label || '').toLowerCase().includes(input.toLowerCase());

  const renderOrgOptionLabel = (option: any) => {
    if (option.data?.managedByDigitalzone) {
      return (
        <Flex align="center" gap="0.5rem">
          <Text ellipsis>{option.label}</Text>
          <Text
            style={{
              background: '#235aed',
              color: '#fff',
              fontWeight: 500,
              padding: '2px 4px',
              borderRadius: '0.2rem',
              fontSize: '0.75rem',
            }}
          >
            DZ
          </Text>
        </Flex>
      );
    }
    return option.label;
  };

  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const isManaged = managedOrgIds.includes(value);
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#f5f5f5',
          borderRadius: 4,
          padding: '0 8px',
          marginRight: 4,
          marginBottom: 2,
        }}
      >
        {label}
        <Hideable show={isManaged}>
          <Text
            style={{
              background: '#235aed',
              color: '#fff',
              marginLeft: '0.5rem',
              padding: '0 2px',
              borderRadius: '0.2rem',
              fontSize: '0.625rem',
            }}
          >
            DZ
          </Text>
        </Hideable>
        <Hideable show={!isManaged && closable}>
          <span
            style={{ marginLeft: 6, cursor: 'pointer' }}
            onClick={onClose}
          >
            ×
          </span>
        </Hideable>
      </span>
    );
  };

  const orgDropdownRender = (menu: React.ReactElement) => {
    if (!(isDzoneUser && isMarketer)) return menu;
    const currentOrgs: string[] = form.getFieldValue('organizations') || [];
    const allSelected = organizationsList.length > 0 && currentOrgs.length === organizationsList.length;
    return (
      <>
        <Flex style={{ padding: '8px 4px' }} align="center" gap="0.5rem">
          <Checkbox onChange={handleSelectAllOrgs} checked={allSelected}>
            <Flex align="center" gap="0.5rem">
              <Text strong>{allSelected ? t('Unselect') : t('Select')} All</Text>
              <Text type="secondary">({currentOrgs.length} selected)</Text>
            </Flex>
          </Checkbox>
        </Flex>
        <Divider style={{ margin: '4px 0' }} />
        {menu}
      </>
    );
  };

  const orgSelectOptions = organizationsList.map((opt) =>
    assignAllManagedOrgs && isDzoneUser && isMarketer && opt.managedByDigitalzone
      ? { ...opt, disabled: true }
      : opt,
  );

  const handleOrgChange = (values: string | string[]) => {
    if (isDzoneUser && isMarketer && assignAllManagedOrgs) {
      const multiValues = Array.isArray(values) ? values : [values];
      const missingManaged = managedOrgIds.filter(
        (id) => id && !multiValues.includes(id),
      );
      if (missingManaged.length > 0) {
        form.setFieldValue(
          'organizations',
          Array.from(new Set([...multiValues, ...missingManaged])),
        );
      }
    }
  };

  return (
    <>
      <Flex vertical style={{ padding: '1.5rem' }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={onValuesChange}
          onFinish={onFinish}
        >
          <Flex vertical gap="1rem" justify="space-between" style={{ height: '100%' }}>
            <Flex vertical gap="1rem">
              <Text strong>
                {isEditing
                  ? `${t('User Status')}: ${user?.status}`
                  : t('Fill Details to Invite User')}
              </Text>

              <Row>
                <Col lg={12} md={24} sm={24} xs={24}>
                  <Row gutter={16}>
                    <Col sm={12} xs={24}>
                      <Form.Item
                        name="firstName"
                        label={t('First Name')}
                        rules={[{ required: true, message: t('This field is required') }]}
                      >
                        <Input placeholder={t('Enter first name')} />
                      </Form.Item>
                    </Col>
                    <Col sm={12} xs={24}>
                      <Form.Item
                        name="lastName"
                        label={t('Last Name')}
                        rules={[{ required: true, message: t('This field is required') }]}
                      >
                        <Input placeholder={t('Enter last name')} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="email"
                        label={t('Email ID')}
                        rules={[
                          { required: true, message: t('This field is required') },
                          { type: 'email', message: t('Invalid email') },
                        ]}
                      >
                        <Input
                          placeholder={t('Enter email id')}
                          disabled={isEditing}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="type"
                        label={t('Tenant Type')}
                        rules={[{ required: true, message: t('This field is required') }]}
                      >
                        <Radio.Group>
                          <MapFunction
                            items={orgTypes}
                            renderItem={(type: any) => (
                              <Radio
                                key={type.id}
                                value={type.name}
                                disabled={isEditing}
                              >
                                {t(type.name)}
                              </Radio>
                            )}
                          />
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item name="isDzoneUser" valuePropName="checked">
                        <Checkbox disabled={!isMarketer}>
                          {t('Is DZOne User')}
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="roles"
                        label={t('Roles')}
                        rules={[{ required: true, message: t('This field is required') }]}
                      >
                        <Select
                          placeholder={t('Select roles')}
                          options={roles}
                          filterOption={handleFilterOption}
                          mode="multiple"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Hideable show={isDzoneUser && isMarketer}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="autoAssignMarketers"
                          valuePropName="checked"
                        >
                          <Checkbox
                            checked={assignAllManagedOrgs}
                            disabled={organizationsList.length === 0}
                            onChange={(e) =>
                              handleAssignAllManagedOrgsChange(e.target.checked)
                            }
                          >
                            {t('Assign All Managed by Digitalzone Organizations')}
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Hideable>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="organizations"
                        label={
                          isMarketer
                            ? t(TenantTypeEnum.MARKETER)
                            : t(TenantTypeEnum.SUPPLIER)
                        }
                        rules={[{ required: true, message: t('This field is required') }]}
                      >
                        <Select
                          placeholder={
                            isMarketer
                              ? t(TenantTypeEnum.MARKETER)
                              : t(TenantTypeEnum.SUPPLIER)
                          }
                          options={orgSelectOptions}
                          optionLabelProp="label"
                          optionRender={renderOrgOptionLabel}
                          dropdownRender={
                            isDzoneUser && isMarketer
                              ? orgDropdownRender
                              : undefined
                          }
                          mode={
                            isDzoneUser && isMarketer ? 'multiple' : undefined
                          }
                          tagRender={
                            isDzoneUser && isMarketer ? tagRender : undefined
                          }
                          onChange={handleOrgChange}
                          filterOption={handleFilterOption}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Flex>

            <UserFormActions
              onCancel={handleCancel}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              isReadOnly={isEditing ? !user?.editable : false}
            />
          </Flex>
        </Form>
      </Flex>

      <Modal
        closable
        open={emailModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Flex
          gap="2rem"
          vertical
          align="center"
          style={{ padding: '2rem' }}
        >
          <Title level={4}>{t('Email has been sent!')}</Title>
          <Text style={{ textAlign: 'center' }}>
            {t(
              `All Set! An invite has been sent to ${createdEmail}. Once they accept the invitation, they'll be able to access the platform`,
            )}
          </Text>
        </Flex>
      </Modal>
    </>
  );
};
