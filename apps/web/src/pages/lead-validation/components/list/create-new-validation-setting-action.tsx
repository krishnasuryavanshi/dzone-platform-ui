import { type FC, useEffect, useState } from 'react';
import { Button, Flex, Form, Input, Modal, Select, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { useTranslation } from 'react-i18next';
import { fetchOrganizationsByType } from '../../../admin/organizations/services';
import { useValidationSettingStore } from '../../stores/use-validation-settings-store';

const { Text, Title } = Typography;

export const CreateNewValidationSettingAction: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [marketerList, setMarketerList] = useState<{ label: string; value: string }[]>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { setSettingMetadata, resetAll } = useValidationSettingStore();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMarketerList();
  }, []);

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

  const handleOpen = () => {
    form.resetFields();
    resetAll();
    setIsModalOpened(true);
  };

  const handleStart = async () => {
    try {
      const values = await form.validateFields();
      setSettingMetadata({ tenantCode: values.tenantCode, name: values.name });
      setIsModalOpened(false);
      navigate('/lead-validation-settings/create');
    } catch {
      /* validation failed */
    }
  };

  return (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: '1rem' }}>
        <Text style={{ fontWeight: 600, paddingLeft: '0.5rem', paddingTop: '0.5rem' }}>
          {t('pages.leadValidationSettings.title', 'Lead Validation Settings')}
        </Text>
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '0.3125rem',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
            border: '1.5px solid transparent',
            height: '2.25rem',
          }}
          onClick={handleOpen}>
          {t('pages.leadValidationSettings.label.createNew', 'Create New')}
        </Button>
      </Flex>
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStart}
          initialValues={{ tenantCode: marketerList[0]?.value }}>
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
                style={{ height: '3rem' }}
                disabled={marketerList?.length === 1}
                placeholder="Select the Marketer"
                options={marketerList}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Flex>
          <Flex gap="0.5rem" align="center" justify="flex-end">
            <Button onClick={() => setIsModalOpened(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Start creating validation settings
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
