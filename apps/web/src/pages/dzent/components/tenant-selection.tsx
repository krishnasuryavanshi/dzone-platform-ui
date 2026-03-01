import { type FC, useEffect, useState } from 'react';
import { Button, Flex, Form, Modal, Select, Typography } from 'antd';
import { useDzentStore } from '../stores/use-dzent-store';
import { fetchOrganizationsByType } from '../../admin/organizations/services';

const { Title } = Typography;

type DzRecord = Record<string, any>;

interface TenantSelectionProps {
  userId?: string;
}

export const TenantSelection: FC<TenantSelectionProps> = ({ userId }) => {
  const { setTenantCode, setMarketerList } = useDzentStore();
  const [marketerList, setMarketerListState] = useState<DzRecord[]>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMarketerList();
    setIsModalOpened(true);
  }, []);

  const fetchMarketerList = async () => {
    try {
      const { data } = await fetchOrganizationsByType('Marketer', userId);
      const marketers = data?.map(({ name: label, code }: DzRecord) => ({
        label,
        value: code,
      }));
      setMarketerListState(marketers || []);
      setMarketerList(marketers);
    } catch {
      // silent
    }
  };

  const handleStart = async () => {
    try {
      const values = await form.validateFields();
      setIsModalOpened(false);
      setTenantCode(values.tenantCode);
    } catch {
      // silent
    }
  };

  return (
    <Modal
      width="30rem"
      open={isModalOpened}
      maskClosable={false}
      onCancel={() => setTenantCode(marketerList[0]?.value)}
      title={
        <Title level={5} style={{ margin: 0 }}>
          Select Marketer
        </Title>
      }
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleStart}>
        <Flex gap="0.5rem" vertical style={{ paddingBlock: '1rem' }}>
          <Form.Item
            className="input-control form-control-item"
            name="tenantCode"
            label={null}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Select
              style={{ height: '3rem' }}
              placeholder="Select the Marketer"
              options={marketerList as any}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Flex>
        <Flex gap="0.5rem" align="center" justify="flex-end">
          <Button type="primary" htmlType="submit">
            Go
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};
