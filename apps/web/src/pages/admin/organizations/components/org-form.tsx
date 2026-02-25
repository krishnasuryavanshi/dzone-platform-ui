import { type FC, useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Flex,
  Row,
  Col,
  Typography,
  notification,
  Spin,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MapFunction } from '@dzone/shared-ui';
import {
  useOrganizationTypes,
  useCreateOrganization,
  useUpdateOrganization,
} from '../hooks';
import { MARKETER_TYPE_LABEL } from '../lib/constants';
import type { IOrganization } from '../lib/types';

const { Text } = Typography;

interface IOrgFormProps {
  isEditing?: boolean;
  organization?: IOrganization;
}

export const OrgForm: FC<IOrgFormProps> = ({ isEditing, organization }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { data: orgTypes = [], isLoading: typesLoading } =
    useOrganizationTypes();
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();

  const orgTypeOptions = useMemo(
    () => orgTypes.map((ot) => ({ label: ot.name, value: ot.id })),
    [orgTypes],
  );

  const orgTypeId = Form.useWatch('organizationTypeId', form);
  const orgTypeLabel = orgTypeOptions.find((t) => t.value === orgTypeId)?.label;
  const isMarketerType = orgTypeLabel === MARKETER_TYPE_LABEL;

  useEffect(() => {
    if (isEditing && organization) {
      form.setFieldsValue({
        name: organization.name,
        businessDomain: organization.businessDomain,
        organizationTypeId: organization.organizationType?.id,
        managedByDigitalzone: organization.managedByDigitalzone,
        crmId: organization.crmId,
        financeId: organization.financeId,
      });
    }
  }, [organization, isEditing, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onFinish = async (values: Record<string, any>) => {
    const onSuccess = (res: any) => {
      notification.success({
        message: res?.message ?? (isEditing ? 'Updated' : 'Created'),
      });
      navigate('/organizations');
    };

    const onError = () => {
      notification.error({
        message: `Failed to ${isEditing ? 'update' : 'create'} organization`,
      });
    };

    if (isEditing && organization?.id) {
      updateMutation.mutate(
        { organizationId: organization.id, payload: values },
        { onSuccess, onError },
      );
    } else {
      createMutation.mutate(values, { onSuccess, onError });
    }
  };

  if (typesLoading) return <Spin />;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Flex vertical justify="space-between" style={{ height: '100%' }} gap="1rem">
        <Flex vertical gap="1rem">
          {!isEditing && (
            <Text strong>
              {t('Enter the required information to create organization')}
            </Text>
          )}
          <Row>
            <Col lg={8} md={16} sm={24} xs={24}>
              <Form.Item
                className="input-control form-control-item"
                name="name"
                label={t('Organization Name')}
                rules={[
                  { max: 150 },
                  { required: true, message: t('This field is required') },
                ]}
              >
                <Input
                  placeholder={t('Enter Organization Name')}
                  disabled={isEditing}
                />
              </Form.Item>

              <Form.Item
                className="input-control form-control-item"
                name="businessDomain"
                label={t('Business Domain')}
                rules={[
                  { max: 150 },
                  { required: true, message: t('This field is required') },
                ]}
              >
                <Input placeholder={t('Enter Business Domain, e.g. Google.com')} />
              </Form.Item>

              <Form.Item
                className="input-control form-control-item"
                name="organizationTypeId"
                label={t('Organization Type')}
                rules={[
                  { required: true, message: t('This field is required') },
                ]}
              >
                <Radio.Group>
                  <MapFunction
                    items={orgTypeOptions}
                    renderItem={(opt) => (
                      <Radio
                        key={opt.value}
                        value={opt.value}
                        disabled={isEditing}
                      >
                        {opt.label}
                      </Radio>
                    )}
                  />
                </Radio.Group>
              </Form.Item>

              {isMarketerType ? (
                <Form.Item
                  name="managedByDigitalzone"
                  valuePropName="checked"
                >
                  <Checkbox>
                    {t(
                      'pages.organizations.label.managedByDigitalZone',
                      'Managed By DigitalZone',
                    )}
                  </Checkbox>
                </Form.Item>
              ) : null}

              <Form.Item
                className="input-control form-control-item"
                name="crmId"
                label={t('CRM ID')}
                rules={[
                  {
                    required: isMarketerType,
                    message: t('This field is required'),
                  },
                ]}
              >
                <Input placeholder={t('Enter CRM ID')} />
              </Form.Item>

              <Form.Item
                className="input-control form-control-item"
                name="financeId"
                label={t('Finance ID')}
                rules={[
                  {
                    required: isMarketerType,
                    message: t('This field is required'),
                  },
                ]}
              >
                <Input placeholder={t('Enter Finance ID')} />
              </Form.Item>
            </Col>
          </Row>
        </Flex>

        <Flex gap="1rem" justify="end">
          <Button onClick={() => navigate('/organizations')}>
            {t('Cancel')}
          </Button>
          <Button type="primary" htmlType="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingOutlined />
            ) : isEditing ? (
              t('Update Organization')
            ) : (
              t('Create Organization')
            )}
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};
