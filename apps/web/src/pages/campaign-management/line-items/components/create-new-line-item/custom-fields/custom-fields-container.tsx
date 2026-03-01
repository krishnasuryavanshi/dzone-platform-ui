import { notification, Flex, Form, Typography } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router';
import { ILineItem } from '../../../lib/types';
import { formatCustomFieldsPayload } from '../../../lib/utils/custom-fields';
import { updateLineItemCustomFields } from '../../../services';
import { CustomField } from './custom-field';
import { CustomFieldInstructions } from './custom-field-instructions';
import { CustomFieldsActions } from './custom-fields-actions';

const { Text } = Typography;

interface ICustomFieldsContainerProps {
  lineItemDetails?: ILineItem;
  initialValues?: Record<string, any>;
}

export const CustomFieldsContainer: FC<ICustomFieldsContainerProps> = ({
  initialValues,
  lineItemDetails,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = async (values: Record<string, any>) => {
    const payload = formatCustomFieldsPayload(values);
    const data = await updateLineItemCustomFields(
      lineItemDetails?.id as string,
      payload,
    );
    if (data?.message) {
      notification.success({
        message: data.message,
      });
      navigate('/campaign-management/line-items');
    }
  };

  return (
    <Flex vertical gap='1rem'>
      <Text style={{ color: '#6B7280', fontSize: '0.875rem' }} strong>
        {
          "Feel free to add any extra questions you'd like to include in the Lead template."
        }
      </Text>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={initialValues}>
        <CustomField form={form} />
        <CustomFieldInstructions />
        <CustomFieldsActions
          loading={false}
          handleCancel={() => navigate('/campaign-management/line-items')}
        />
      </Form>
    </Flex>
  );
};
