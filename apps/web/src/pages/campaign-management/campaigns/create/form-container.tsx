import { FC } from 'react';
import { Form, Row, Col, Flex, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { renderField } from '../../components';
import { useCampaignForm } from '../lib/hooks';
import { ICampaign } from '../lib/types';

const { Text } = Typography;

interface IContainerProps {
  campaignData: ICampaign | null;
  campaignUUId?: string;
  tenantCode?: string[];
  userId?: string;
  isDzoneUser?: boolean;
}

export const FormContainer: FC<IContainerProps> = (props) => {
  const { t } = useTranslation();
  const {
    form,
    handleSubmit,
    isSubmitting,
    hasChanges,
    groupedFields,
    lists,
    marketerCode,
    processFieldRules,
  } = useCampaignForm(props);

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Row
        gutter={16}
        justify="start"
        style={{ paddingLeft: '0.5rem', marginBottom: '2rem' }}
      >
        <Text
          style={{
            color: '#464343',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {t('pages.campaigns.label.requiredInfo')}
        </Text>
      </Row>
      {Object.keys(groupedFields).map((group) => (
        <Row key={group} gutter={16}>
          {groupedFields[group]
            .sort(
              (a: { order: number }, b: { order: number }) =>
                a.order - b.order,
            )
            .map((field: any, index: number) => {
              if (field.hidden) {
                return (
                  <Form.Item key={index} name={field.field} hidden>
                    {renderField(field, lists, form, marketerCode)}
                  </Form.Item>
                );
              }
              return (
                <Col key={index} span={field.span || 10}>
                  <Form.Item
                    className="input-control form-control-item"
                    label={field.fieldType === 'checkbox' ? '' : field.label}
                    name={field.field}
                    rules={processFieldRules(field)}
                  >
                    {renderField(field, lists, form, marketerCode, {
                      ioFiles: form.getFieldValue('ioFileId'),
                    })}
                  </Form.Item>
                </Col>
              );
            })}
        </Row>
      ))}
      <Flex
        justify="end"
        style={{ marginBottom: '3rem', marginRight: '2rem' }}
      >
        <Button
          htmlType="submit"
          type="primary"
          loading={isSubmitting}
          disabled={!hasChanges}
          style={{ boxShadow: 'none' }}
        >
          {props?.campaignUUId ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </Flex>
    </Form>
  );
};
