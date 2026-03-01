import { LoaderButton } from '@dzone/shared-ui';
import { Button, Checkbox, Col, Divider, Flex, Row, Space, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

interface IReturnReasonsModalBodyProps {
  reasons: { name: string; value: string }[];
  leadIds: number[];
  isLoading: boolean;
  handleSelectReason: (selectedValues: string[]) => void;
  handleReturnLeads: () => void;
  selectedReasons?: string[];
}

export const ReturnReasonsModalBody: FC<IReturnReasonsModalBodyProps> = ({
  reasons,
  leadIds,
  isLoading,
  handleSelectReason,
  handleReturnLeads,
  selectedReasons = [],
}) => {
  return (
    <Space
      direction='vertical'
      style={{
        width: '100%',
        padding: '1.125rem',
        background: '#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}
      size={0}>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={selectedReasons}
        onChange={handleSelectReason}>
        <Space direction='vertical' style={{ width: '100%' }} size={8}>
          {reasons.map((reason: { name: string; value: string }) => (
            <Row
              key={reason.value}
              align='middle'
              style={{
                width: '100%',
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: '0.625rem 1rem',
              }}>
              <Col flex='none'>
                <Checkbox value={reason.value} style={{ fontWeight: 600 }}>
                  {reason.name}
                </Checkbox>
              </Col>
            </Row>
          ))}
        </Space>
      </Checkbox.Group>
      <Divider style={{ margin: '1.5rem 0 1rem 0' }} />
      <Flex justify='space-between' align='center'>
        <Text type='secondary'>{leadIds.length} leads selected</Text>
        {isLoading ? (
          <LoaderButton style={{ width: '5.65rem' }} />
        ) : (
          <Button
            type='primary'
            style={{
              background: '#235AED',
              color: '#fff',
              borderRadius: 6,
              minWidth: 90,
              fontSize: 16,
              height: 46,
            }}
            disabled={selectedReasons.length === 0 || isLoading}
            loading={isLoading}
            onClick={handleReturnLeads}>
            Return
          </Button>
        )}
      </Flex>
    </Space>
  );
};
