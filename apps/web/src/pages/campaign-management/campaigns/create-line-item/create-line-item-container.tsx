import { FC } from 'react';
import { notification } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import { ModalForm } from '@dzone/shared-ui';
import { formatDate } from '@dzone/shared-lib';
import { createLineItem } from '../services';
import { CreateLineItemForm } from './create-line-item-form';
import { CampaignIdField } from './campaign-id-field';
import { createLineItemConfig } from './config';
import { useFormConfig } from './use-form-config';
import './create-line-item.module.css';

interface ICreateLineItemContainerProps {
  show: boolean;
  campaignId: string;
  campaignUuid: string;
  handleCloseLineItemForm: () => void;
}

export const CreateLineIitemContainer: FC<ICreateLineItemContainerProps> = ({
  show,
  campaignId,
  campaignUuid,
  handleCloseLineItemForm,
}) => {
  const [form] = useForm();

  const handleLeadChange = () => {
    const total =
      +(form.getFieldValue('billableLeads') || 0) +
      +(form.getFieldValue('valueAddLeads') || 0);
    form.setFieldsValue({ totalLeads: total });
  };

  createLineItemConfig.fields.billableLeads.input.onChange = handleLeadChange;
  createLineItemConfig.fields.valueAddLeads.input.onChange = handleLeadChange;
  const { meta, fields, headings } = useFormConfig(createLineItemConfig);

  if (!show) {
    return null;
  }

  const onFinish = async (values: any) => {
    const startDate = formatDate(values.startDate);
    const endDate = formatDate(values.endDate);
    const requestData = { ...values, startDate, endDate, campaignUuid };
    try {
      const { message } = await createLineItem(requestData);
      notification.success({ message });
      handleCloseLineItemForm();
      form.resetFields();
    } catch (error) {
      // Error handled silently
    }
  };

  const onCancel = () => {
    handleCloseLineItemForm();
    form.resetFields();
  };

  const formProps = {
    ...headings,
    form,
    onFinish,
    meta,
  };

  const CampaignIdFieldComponent = <CampaignIdField value={campaignId} />;

  return (
    <ModalForm
      handleCancel={onCancel}
      open={show}
      formProps={formProps}
      extra={CampaignIdFieldComponent}
    >
      <CreateLineItemForm fields={fields} />
    </ModalForm>
  );
};
