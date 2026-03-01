import { type FC, useEffect, useState } from 'react';
import { Button, Flex, Form, Input, Modal, Select, Typography, notification } from 'antd';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { Hideable } from '@dzone/shared-ui';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';
import { fetchOrganizationsByType } from '../../../admin/organizations/services';
import { formatPayload, getNavigationUrl } from '../../lib/utils';
import {
  createLeadValidationSetting,
  updateLineItemsLeadValidationSetting,
  updateMarketersLeadValidationSetting,
} from '../../services';

const { Title } = Typography;

export const ValidationSettingsActions: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [marketerList, setMarketerList] = useState<{ label: string; value: string }[]>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const {
    isReadOnly,
    isEditing,
    settingMetadata,
    enabledRules,
    selectedValues,
    resetAll,
    leadValidationSettingConfig,
  } = useValidationSettingStore();

  const [form] = Form.useForm();

  useEffect(() => {
    fetchMarketerList();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: settingMetadata?.name,
      tenantCode: settingMetadata?.tenantCode,
    });
  }, [isEditing, settingMetadata]);

  const fetchMarketerList = async () => {
    try {
      const result = await fetchOrganizationsByType('Marketer', user?.userId);
      const marketers = (result?.data || []).map(({ name, code }: any) => ({
        label: name,
        value: code,
      }));
      setMarketerList(marketers);
    } catch {
      /* silent */
    }
  };

  const saveData = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      const lineItemId = settingMetadata?.lineItemId;
      const payload = formatPayload(
        values,
        enabledRules,
        selectedValues,
        leadValidationSettingConfig as Record<string, any>,
      );

      let result;
      if (isEditing) {
        if (lineItemId) {
          result = await updateLineItemsLeadValidationSetting(
            lineItemId,
            settingMetadata?.id as string,
            payload,
          );
        } else {
          result = await updateMarketersLeadValidationSetting(
            settingMetadata?.tenantCode as string,
            settingMetadata?.id as string,
            payload,
          );
        }
      } else {
        result = await createLeadValidationSetting(
          settingMetadata?.tenantCode as string,
          payload,
        );
      }

      if (result?.message) {
        notification.success({ message: result.message });
      }

      resetAll();
      setIsModalOpened(false);
      const redirectTo = searchParams.get('redirectTo') || undefined;
      navigate(getNavigationUrl(lineItemId, redirectTo));
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    if (!isEditing) {
      await saveData({
        name: settingMetadata?.name,
        tenantCode: settingMetadata?.tenantCode,
      });
    } else {
      setIsModalOpened(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await saveData(values);
    } catch {
      /* validation failed */
    }
  };

  return (
    <>
      <Hideable show={!isReadOnly}>
        <Button type="primary" onClick={handleOpen} loading={loading}>
          {isEditing ? 'Update Template' : 'Save and create template'}
        </Button>
      </Hideable>
      <Modal
        width="30rem"
        open={isModalOpened}
        onCancel={() => setIsModalOpened(false)}
        maskClosable={false}
        title={
          <Title level={5} style={{ margin: 0 }}>
            Name the setting
          </Title>
        }
        footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Flex gap="0.5rem" vertical style={{ paddingBlock: '1rem' }}>
            <Form.Item
              className="input-control form-control-item"
              name="name"
              label={null}
              rules={[
                { required: true, message: 'This field is required' },
                { pattern: /^\S.*\S$|^\S$/, message: 'No trailing spaces allowed' },
              ]}>
              <Input style={{ height: '3rem' }} placeholder="Enter the setting name" />
            </Form.Item>
            <Form.Item
              className="input-control form-control-item"
              name="tenantCode"
              label={null}
              rules={[{ required: true, message: 'This field is required' }]}>
              <Select
                disabled
                style={{ height: '3rem' }}
                placeholder="Select the Marketer"
                options={marketerList}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Flex>
          <Flex gap="0.5rem" align="center" justify="flex-end">
            <Button onClick={() => setIsModalOpened(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
