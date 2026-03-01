import { Flex, Tooltip, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FC } from 'react';

const { Text } = Typography;

interface IChipItemProps {
  label: string;
  onClose: () => void;
}

export const ChipItem: FC<IChipItemProps> = ({ label, onClose }) => {
  if (!label?.trim()) {
    return null;
  }

  return (
    <Tooltip title={label}>
      <Flex
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          backgroundColor: '#EEF2FF',
          border: '1px solid #6366F1',
          borderRadius: '8px',
          maxWidth: '100%',
        }}>
        <Text
          ellipsis
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: '0.875rem',
            color: '#374151',
          }}>
          {label}
        </Text>
        <CloseOutlined
          style={{
            fontSize: '0.75rem',
            cursor: 'pointer',
            color: '#6B7280',
            flexShrink: 0,
          }}
          onClick={onClose}
        />
      </Flex>
    </Tooltip>
  );
};
