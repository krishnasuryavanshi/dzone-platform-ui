import { type FC, useState } from 'react';
import { Form, Input, Select, Row, Col, Flex, Typography, Radio, Modal } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { MapFunction } from '@dzone/shared-ui';
import { Hideable } from '@dzone/shared-ui';
import { useOrganizationTypes } from '../../../admin/organizations/hooks';
import { useEditStore } from '../stores';
import { STATUS_OPTIONS } from '../lib/constants';
import { RoleStatus } from '../lib/types';
import type { IRoleDetails } from '../lib/types';

const { Text } = Typography;
const { TextArea } = Input;

interface IBasicDetailsFormProps {
  form: FormInstance;
  roleDetails?: IRoleDetails;
}

export const BasicDetailsForm: FC<IBasicDetailsFormProps> = ({
  form,
  roleDetails,
}) => {
  const { t } = useTranslation();
  const { isEditAllowed } = useEditStore();
  const { data: orgTypes } = useOrganizationTypes();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const isExisting = !!roleDetails?.id;
  const isDisabled = !isEditAllowed && isExisting;

  const handleStatusChange = (value: string) => {
    if (
      value === RoleStatus.INACTIVE &&
      roleDetails?.status?.name === RoleStatus.ACTIVE
    ) {
      setPendingStatus(value);
      setStatusModalOpen(true);
    } else {
      form.setFieldsValue({ status: value });
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) form.setFieldsValue({ status: pendingStatus });
    setStatusModalOpen(false);
  };

  const getStatusOptions = () => {
    const current = roleDetails?.status?.name;
    if (current === RoleStatus.ACTIVE) {
      return STATUS_OPTIONS.filter((o) => o.value === RoleStatus.INACTIVE);
    }
    if (current === RoleStatus.INACTIVE) {
      return STATUS_OPTIONS.filter((o) => o.value === RoleStatus.ACTIVE);
    }
    return STATUS_OPTIONS;
  };

  const tenantTypes = orgTypes ?? [];

  return (
    <>
      <Flex vertical gap="0.75rem">
        <Text style={{ fontWeight: 600, color: '#707070' }}>
          {t('Basic Details')}
        </Text>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              name="name"
              label={t('Role Name')}
              className="form-control-item"
              rules={[
                { required: true, message: t('This field is required') },
                {
                  pattern: /^[A-Za-z0-9\-_ ]+$/,
                  message: t('Only letters, numbers, hyphens, underscores allowed'),
                },
                { min: 3, message: t('Minimum 3 characters') },
                { max: 50, message: t('Maximum 50 characters') },
              ]}
            >
              <Input
                placeholder={t('Enter role name')}
                disabled={isDisabled}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="description"
              label={t('Description')}
              className="form-control-item"
              rules={[{ max: 500, message: t('Maximum 500 characters') }]}
            >
              <TextArea
                placeholder={t('Enter role description')}
                disabled={isDisabled}
                autoSize={false}
                style={{
                  height: '3rem',
                  lineHeight: 'normal',
                  paddingTop: '0.75rem',
                }}
              />
            </Form.Item>
          </Col>
          <Hideable show={isExisting}>
            <Col span={8}>
              <Form.Item
                name="status"
                label={t('Status')}
                className="form-control-item"
              >
                <Select
                  disabled={isDisabled}
                  onChange={handleStatusChange}
                  options={getStatusOptions()}
                />
              </Form.Item>
            </Col>
          </Hideable>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="tenantType"
              label={t('Tenant Type')}
              className="form-control-item"
              rules={[{ required: true, message: t('This field is required') }]}
            >
              <Radio.Group disabled={isDisabled}>
                <MapFunction
                  items={tenantTypes}
                  renderItem={(type: any) => (
                    <Radio key={type.id} value={type.name} disabled={isDisabled}>
                      {t(type.name)}
                    </Radio>
                  )}
                />
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Flex>

      <Modal
        open={statusModalOpen}
        onOk={handleConfirmStatusChange}
        onCancel={() => setStatusModalOpen(false)}
        okText={t('Proceed')}
        cancelText={t('Cancel')}
        okButtonProps={{ danger: true }}
        title={
          <Flex align="center" gap="0.5rem">
            <ExclamationCircleOutlined style={{ color: '#E04149' }} />
            <Text strong>{t('Change Status')}</Text>
          </Flex>
        }
      >
        <Text>
          {t('Changing the status to Inactive will revoke access for all associated users. Proceed?')}
        </Text>
      </Modal>
    </>
  );
};
