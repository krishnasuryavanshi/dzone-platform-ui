import { Flex, Progress, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FC } from 'react';
import styles from './lead-validation-progress.module.css';

const { Text } = Typography;

interface ILeadValidationProgressProps {
  inValidationCount: number;
  validInvalidCount: number;
  taskStatus?: string | null;
}

export const LeadValidationProgress: FC<ILeadValidationProgressProps> = ({
  inValidationCount,
  validInvalidCount,
  taskStatus,
}) => {
  const totalCount = inValidationCount + validInvalidCount;
  const processedCount = validInvalidCount;
  const percentage =
    totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  // Get status message based on task status
  const getStatusMessage = () => {
    if (taskStatus) {
      switch (taskStatus) {
        case 'Queued':
          return 'Upload queued for processing...';
        case 'Retry':
          return 'Retrying upload processing...';
        case 'Failed':
          return 'Upload processing failed';
        default:
          return 'Processing...';
      }
    }
    return 'Validating Leads...';
  };

  // Show different UI based on task status
  if (taskStatus && !inValidationCount && !validInvalidCount) {
    return (
      <Flex align='center' gap='1rem' className={styles.progressContainer}>
        <Flex align='center' gap='0.5rem'>
          <LoadingOutlined spin />
          <Text strong className={styles.label}>
            {getStatusMessage()}
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex align='center' gap='1rem' className={styles.progressContainer}>
      <Flex align='center' gap='0.5rem'>
        <LoadingOutlined spin />
        <Text strong className={styles.label}>
          {getStatusMessage()}
        </Text>
      </Flex>
      <Progress
        percent={percentage}
        status='active'
        strokeColor='#04CA56'
        trailColor='#e8e8e8'
        showInfo={false}
        className={styles.progressBar}
        strokeWidth={10}
      />
      <Text strong className={styles.progressCount}>
        {processedCount.toLocaleString()} / {totalCount.toLocaleString()}
      </Text>
      <Text type='secondary' className={styles.statusText}>
        {inValidationCount.toLocaleString()} leads remaining in validation
      </Text>
    </Flex>
  );
};
