import { type FC } from 'react';
import { Drawer } from '@dzone/shared-ui';
import { Flex, Space, Timeline, Typography } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { JobStatusBadge } from './job-status-badge';
import { JobTypeBadge } from './job-type-badge';
import type { IJob, IJobStep } from '../lib/types';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Text } = Typography;

const formatDate = (date: string | null) => {
  if (!date) return '-';
  return dayjs.utc(date).tz(dayjs.tz.guess()).format('DD MMM YYYY, hh:mm A');
};

const getStepColor = (step: IJobStep): string => {
  switch (step.status) {
    case 'IN_PROGRESS': return 'blue';
    case 'SUCCESS': return 'green';
    case 'FAILED': return 'red';
    default: return 'gray';
  }
};

const hasValue = (value: number | null | undefined): boolean =>
  value !== null && value !== undefined && value > 0;

const StepContent: FC<{ step: IJobStep }> = ({ step }) => (
  <Space direction="vertical" size={4}>
    <Flex gap="0.5rem" align="center">
      <Text strong>{step.stepName}</Text>
      <JobStatusBadge status={step.status} />
    </Flex>
    <Flex gap="1rem" wrap="wrap">
      {hasValue(step.successCount) && (
        <Text>
          <CheckOutlined style={{ marginRight: 4, color: '#52c41a' }} />
          {step.successCount}/{step.totalCount}
        </Text>
      )}
      {hasValue(step.skippedCount) && (
        <Text>
          <MinusCircleOutlined style={{ marginRight: 4, color: '#faad14' }} />
          {step.skippedCount}/{step.totalCount}
        </Text>
      )}
      {hasValue(step.invalidCount) && (
        <Text>
          <CloseCircleOutlined style={{ marginRight: 4, color: '#ff4d4f' }} />
          {step.invalidCount}/{step.totalCount}
        </Text>
      )}
    </Flex>
    <Flex gap="1rem" wrap="wrap">
      {step.startedAt && (
        <Text>
          <PlayCircleOutlined style={{ marginRight: 4, color: '#595959' }} />
          {formatDate(step.startedAt)}
        </Text>
      )}
      {step.completedAt && (
        <Text>
          <CheckCircleOutlined style={{ marginRight: 4, color: '#595959' }} />
          {formatDate(step.completedAt)}
        </Text>
      )}
    </Flex>
  </Space>
);

interface JobStepsDrawerProps {
  job: IJob | null;
  open: boolean;
  onClose: () => void;
}

export const JobStepsDrawer: FC<JobStepsDrawerProps> = ({ job, open, onClose }) => {
  if (!job) return null;

  const timelineItems =
    job.steps
      ?.sort((a, b) => b.stepOrder - a.stepOrder)
      .map((step) => ({
        color: getStepColor(step),
        children: <StepContent step={step} />,
      })) || [];

  return (
    <Drawer
      title={
        <Flex gap="0.5rem" align="center">
          <Text strong>Job: {job.jobId?.split('-').pop()?.toUpperCase()}</Text>
          <JobTypeBadge jobType={job.jobType} />
          <JobStatusBadge status={job.status} />
        </Flex>
      }
      placement="right"
      width={500}
      open={open}
      onClose={onClose}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size={8}>
          <Flex align="center" gap="0.5rem">
            <FileTextOutlined />
            <Text>{job.lineItemId}</Text>
          </Flex>
          <Flex align="center" gap="0.5rem">
            <UserOutlined />
            <Text>{job.email}</Text>
          </Flex>
          <Flex align="center" gap="0.5rem">
            <PlayCircleOutlined />
            <Text>{formatDate(job.startedAt)}</Text>
          </Flex>
          <Flex align="center" gap="0.5rem">
            <CheckCircleOutlined />
            <Text>{formatDate(job.completedAt)}</Text>
          </Flex>
          {job.errorMessage && (
            <Flex align="center" gap="0.5rem">
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              <Text type="danger">{job.errorMessage}</Text>
            </Flex>
          )}
        </Space>

        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Text strong>Steps ({job.steps?.length || 0})</Text>
          {timelineItems.length > 0 ? (
            <Timeline items={timelineItems} />
          ) : (
            <Text type="secondary">No steps available</Text>
          )}
        </Space>
      </Space>
    </Drawer>
  );
};
