import { Flex, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { TruncatedTagList } from '../../lead-validation-settings/show-rule/components/truncated-tag-list';

const { Text } = Typography;

export interface IFieldValuesSectionProps {
  label: string;
  values: string[];
  onViewAll: () => void;
}

export const FieldValuesSection: FC<IFieldValuesSectionProps> = ({
  label,
  values,
  onViewAll,
}) => {
  if (values.length === 0) return null;

  const tooltipTitle =
    label === 'Inclusion Values'
      ? 'Only these values will be accepted during Validation'
      : 'Values in this list will not be accepted during Validation';

  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{
        borderRadius: '0.25rem',
        padding: '0.5rem',
        backgroundColor: '#F9FAFB',
      }}>
      <Flex align='center' gap='0.25rem'>
        <Text strong style={{ fontSize: '0.875rem' }}>
          {label}
        </Text>
        <Tooltip title={tooltipTitle}>
          <InfoCircleOutlined
            style={{ color: '#8c8c8c', fontSize: '0.875rem' }}
          />
        </Tooltip>
      </Flex>
      <TruncatedTagList items={values} onViewAll={onViewAll} />
    </Flex>
  );
};
