import { FC, useEffect, useState } from 'react';
import { Button, Col, Drawer, Flex, Form, Row, Select, Space, TimePicker, Typography, notification } from 'antd';
import dayjs from 'dayjs';
import { DeliveryType } from '../../lib/enums/delivery-types';
import {
  createDeliverySchedule,
  updateDeliverySchedule,
  fetchDeliveryTemplateTypes,
  fetchDeliveryTemplateList,
  DeliveryTemplateType,
  DeliveryTemplate,
  DeliverySchedule,
} from '../../services';
import { DELIVERY_FREQUENCY_OPTIONS, WEEK_DAYS } from '../../lib/constants';
import { DayPicker } from './day-picker';

const { Text } = Typography;
const FormItem = Form.Item;

interface IScheduleDeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lineItemId: string;
  onScheduleCreated?: () => void;
  editSchedule?: DeliverySchedule | null;
}

export const ScheduleDeliveryDrawer: FC<IScheduleDeliveryDrawerProps> = ({
  isOpen,
  onClose,
  lineItemId,
  onScheduleCreated,
  editSchedule,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    DeliveryType.FLAT_FILE,
  );
  const [frequency, setFrequency] = useState<
    'Daily' | 'Weekly' | 'Monthly' | 'RealTime'
  >('Daily');
  const [deliveryTemplateTypes, setDeliveryTemplateTypes] = useState<
    DeliveryTemplateType[]
  >([]);
  const [deliveryTemplates, setDeliveryTemplates] = useState<
    DeliveryTemplate[]
  >([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Dynamic options based on API data
  const deliveryTypeOptions = Array.isArray(deliveryTemplateTypes)
    ? deliveryTemplateTypes.map((type) => ({
        label:
          type.deliveryType === DeliveryType.FLAT_FILE
            ? 'Flat File'
            : type.deliveryType,
        value: type.deliveryType,
      }))
    : [];

  const selectedTemplateType = Array.isArray(deliveryTemplateTypes)
    ? deliveryTemplateTypes.find((type) => type.deliveryType === deliveryType)
    : undefined;
  const deliveryFormatOptions =
    selectedTemplateType?.deliveryFormat?.map((format) => ({
      label: format,
      value: format,
    })) || [];

  // Dynamic delivery template options based on API data
  const deliveryTemplateOptions = deliveryTemplates.map((template) => ({
    label: template.name,
    value: template.id,
    integrationId: template.integrationId || '', // always provide integrationId if present
  }));

  useEffect(() => {
    if (isOpen) {
      form.resetFields();

      if (editSchedule) {
        // Edit mode - populate form with existing data
        const initialType = editSchedule.deliveryType as DeliveryType;
        setDeliveryType(initialType);
        setFrequency(editSchedule.frequency);

        // Parse time if exists
        let timeValue = null;
        if (editSchedule.deliveryTime) {
          const [time, period] = editSchedule.deliveryTime.split(' ');
          const [hours, minutes] = time.split(':');
          const hour24 =
            period === 'PM' && hours !== '12'
              ? parseInt(hours) + 12
              : period === 'AM' && hours === '12'
                ? 0
                : parseInt(hours);
          timeValue = dayjs().hour(hour24).minute(parseInt(minutes));
        }

        form.setFieldsValue({
          deliveryType: initialType,
          deliveryFormat: editSchedule.deliveryFormat,
          frequency: editSchedule.frequency,
          deliveryDay: editSchedule.deliveryDay,
          deliveryDate: editSchedule.deliveryDate,
          time: timeValue,
        });

        setInitialLoadDone(false);
        loadDeliveryTemplateTypes();
        loadDeliveryTemplates(initialType);
        setInitialLoadDone(true);
      } else {
        // Create mode - set defaults
        form.setFieldsValue({
          deliveryType: DeliveryType.FLAT_FILE,
          frequency: 'Daily',
        });
        setDeliveryType(DeliveryType.FLAT_FILE);
        setFrequency('Daily');
        setInitialLoadDone(false);
        loadDeliveryTemplateTypes();
        loadDeliveryTemplates(DeliveryType.FLAT_FILE);
        setInitialLoadDone(true);
      }
    }
  }, [isOpen, form, editSchedule]);

  useEffect(() => {
    // Load templates when delivery type changes after initial load
    if (deliveryType && initialLoadDone) {
      loadDeliveryTemplates(deliveryType);
    }
  }, [deliveryType, initialLoadDone]);

  const loadDeliveryTemplateTypes = async () => {
    try {
      const response: any = await fetchDeliveryTemplateTypes();
      if (Array.isArray(response?.data?.data)) {
        setDeliveryTemplateTypes(response?.data?.data || []);
      }
    } catch (error) {
      // Error is handled by service
    }
  };

  const loadDeliveryTemplates = async (type: DeliveryType) => {
    try {
      setLoadingTemplates(true);
      const response = await fetchDeliveryTemplateList(type);
      if (response?.data) {
        setDeliveryTemplates(response.data);
        // Set template ID when templates load
        if (response.data.length > 0) {
          if (editSchedule && editSchedule.deliveryType === type) {
            // Edit mode - try to use existing template ID
            const templateId = editSchedule.deliveryTemplateId;
            if (
              templateId &&
              response.data.some((template) => template.id === templateId)
            ) {
              form.setFieldsValue({
                deliveryTemplateId: templateId,
              });
            } else {
              // Fallback to first template if existing ID not found
              form.setFieldsValue({
                deliveryTemplateId: response.data[0].id,
              });
            }
          } else {
            // Create mode - select first template by default
            form.setFieldsValue({
              deliveryTemplateId: response.data[0].id,
            });
          }
        }
      }
    } catch (error) {
      // Error is handled by service
      setDeliveryTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleDeliveryTypeChange = (value: DeliveryType) => {
    setDeliveryType(value);
    form.setFieldsValue({
      deliveryFormat: undefined,
      deliveryTemplateId: undefined,
    });
    // Templates will be loaded automatically via useEffect
  };

  const handleFrequencyChange = (
    value: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime',
  ) => {
    setFrequency(value);
    form.setFieldsValue({
      deliveryDay: undefined,
      deliveryDate: undefined,
      time: undefined,
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const payload: any = {
        deliveryType: values.deliveryType,
        deliveryFormat:
          values.deliveryType === DeliveryType.FLAT_FILE
            ? values.deliveryFormat
            : null,
        deliveryTemplateId: values.deliveryTemplateId,
        frequency: values.frequency,
        deliveryDay: values.frequency === 'Weekly' ? values.deliveryDay : null,
        deliveryDate:
          values.frequency === 'Monthly' ? values.deliveryDate : null,
        deliveryTime:
          values.frequency !== 'RealTime' && values.time
            ? values.time.format('h:mm A')
            : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      let success = false;

      if (editSchedule) {
        // Update existing schedule
        const updateResponse = await updateDeliverySchedule(
          editSchedule.id,
          payload,
        );
        success = !!updateResponse;
      } else {
        // Create new schedule
        payload.lineItemId = lineItemId;
        const createResponse = await createDeliverySchedule(payload);
        success = !!createResponse;
      }

      if (success) {
        notification.success({
          message: editSchedule
            ? 'Delivery schedule updated successfully'
            : 'Delivery schedule created successfully',
        });
        onScheduleCreated?.();
        onClose();
      }
    } catch (error) {
      // Error is handled by service
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTimeFields = () => {
    if (frequency === 'RealTime') return null;

    return (
      <>
        {frequency === 'Weekly' && (
          <Col span={24}>
            <FormItem
              label='Delivery Day'
              name='deliveryDay'
              rules={[
                { required: true, message: 'Please select delivery day' },
              ]}
              className='input-control form-control-item'>
              <Select
                placeholder='Select day'
                options={WEEK_DAYS}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
        )}
        {frequency === 'Monthly' && (
          <Col span={24}>
            <FormItem
              label='Delivery Date'
              name='deliveryDate'
              rules={[
                { required: true, message: 'Please select delivery date' },
              ]}
              className='input-control form-control-item'>
              <DayPicker
                placeholder='Select date'
                style={{ width: '100%' }}
                className='input-field'
              />
            </FormItem>
          </Col>
        )}
        <Col span={24}>
          <FormItem
            label='Time'
            name='time'
            rules={[{ required: true, message: 'Please select time' }]}
            className='input-control form-control-item'>
            <TimePicker
              use12Hours
              showNow={false}
              format='h:mm A'
              placeholder='00:00 AM'
              className='input-field'
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  return (
    <Drawer
      title={editSchedule ? 'Edit Delivery Schedule' : 'Schedule Delivery'}
      onClose={onClose}
      open={isOpen}
      closable
      maskClosable={false}
      placement='right'
      destroyOnClose
      width='30rem'>
      <Flex vertical>
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem
                label='Delivery Type'
                name='deliveryType'
                rules={[
                  { required: true, message: 'Please select delivery type' },
                ]}
                className='input-control form-control-item'>
                <Select
                  placeholder='Select Delivery Type'
                  options={deliveryTypeOptions}
                  onChange={handleDeliveryTypeChange}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>

            {deliveryType === DeliveryType.FLAT_FILE &&
              selectedTemplateType?.deliveryFormat && (
                <Col span={24}>
                  <FormItem
                    label='Delivery Format'
                    name='deliveryFormat'
                    rules={[
                      {
                        required: true,
                        message: 'Please select delivery format',
                      },
                    ]}
                    className='input-control form-control-item'>
                    <Select
                      placeholder='Select Format'
                      options={deliveryFormatOptions}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>
              )}
            <Col span={24}>
              <FormItem
                label={
                  <Space
                    style={{
                      width: '100%',
                      position: 'relative',
                      columnGap: '0',
                    }}>
                    <Text>Delivery Template</Text>
                  </Space>
                }
                name='deliveryTemplateId'
                rules={[
                  {
                    required: true,
                    message: 'Please select delivery template',
                  },
                ]}
                className='input-control form-control-item'>
                <Select
                  placeholder={
                    loadingTemplates
                      ? 'Loading templates...'
                      : 'Select Template'
                  }
                  options={deliveryTemplateOptions}
                  loading={loadingTemplates}
                  disabled={loadingTemplates}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem
                label='Frequency'
                name='frequency'
                rules={[{ required: true, message: 'Please select frequency' }]}
                className='input-control form-control-item'>
                <Select
                  placeholder='Select Frequency'
                  options={DELIVERY_FREQUENCY_OPTIONS}
                  onChange={handleFrequencyChange}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>

            {renderTimeFields()}
          </Row>

          <Flex justify='end' gap='0.5rem' style={{ marginTop: '2rem' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={isSubmitting}>
              {editSchedule ? 'Update' : 'Schedule'}
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Drawer>
  );
};
