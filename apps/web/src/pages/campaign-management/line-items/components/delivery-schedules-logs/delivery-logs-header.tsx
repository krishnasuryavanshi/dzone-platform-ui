import { Button, Form, DatePicker, Select, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { useDeliveryLogsStore } from './use-delivery-logs-store';
import styles from './delivery-logs-header.module.css';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const [FormItem] = [Form.Item];

interface DeliveryLogsHeaderProps {
  scheduleId: string | null;
  lineItemId?: string;
}

export const DeliveryLogsHeader = ({
  scheduleId,
  lineItemId,
}: DeliveryLogsHeaderProps) => {
  const navigate = useNavigate();
  const { filters, setFilters, fetchLogs, resetFilters } =
    useDeliveryLogsStore();
  const [form] = Form.useForm();

  const handleBack = () => {
    if (lineItemId) {
      navigate(`/campaign-management/line-items/${lineItemId}?tab=delivery`);
    } else {
      navigate(-1);
    }
  };

  const handleFilterChange = (field: string, value: string | undefined) => {
    // Convert empty string to undefined for "All Status" option
    const filterValue = value === '' ? undefined : value;
    setFilters({ [field]: filterValue });
    if (scheduleId) {
      fetchLogs(scheduleId);
    }
  };

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
  ) => {
    if (dates) {
      setFilters({
        startDate: dates[0]?.format('YYYY-MM-DD'),
        endDate: dates[1]?.format('YYYY-MM-DD'),
      });
    } else {
      setFilters({ startDate: undefined, endDate: undefined });
    }
    if (scheduleId) {
      fetchLogs(scheduleId);
    }
  };

  const handleReset = () => {
    form.resetFields();
    resetFilters();
    if (scheduleId) {
      fetchLogs(scheduleId);
    }
  };

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Synced', value: 'SYNCED' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Pending', value: 'PENDING' },
  ];

  return (
    <>
      <Flex justify='space-between' align='center' className={styles.headerTop}>
        <Flex gap='middle' align='center'>
          <Button
            type='text'
            onClick={handleBack}
            className={styles.backButton}>
            Back
          </Button>
          <Text strong style={{ marginBottom: '0' }}>
            Delivery Logs
          </Text>
        </Flex>
        <Button type='primary'>Resend All Failed Leads</Button>
      </Flex>
      <Flex justify='space-between' align='center'>
        <Form form={form} layout='horizontal' className={styles.filterForm}>
          <FormItem label='Date Range'>
            <RangePicker
              value={
                filters.startDate && filters.endDate
                  ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                  : undefined
              }
              onChange={handleDateRangeChange}
              style={{ width: 280 }}
            />
          </FormItem>

          <FormItem label='Status'>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={statusOptions}
              style={{ width: 150 }}
              allowClear
              placeholder='All Status'
            />
          </FormItem>

          <FormItem>
            <Button onClick={handleReset}>Reset Filters</Button>
          </FormItem>
        </Form>
      </Flex>
    </>
  );
};
