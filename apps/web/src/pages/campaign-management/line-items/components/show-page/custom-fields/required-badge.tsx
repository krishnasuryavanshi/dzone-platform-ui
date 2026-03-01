import { Flex, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

export interface IRequiredBadgeProps {
  required: boolean;
}

export const RequiredBadge: FC<IRequiredBadgeProps> = ({ required }) => (
  <Flex
    style={{
      background: '#EAF1FF',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
    }}>
    <Text
      style={{ fontSize: '0.75rem', color: '#235AED', fontWeight: 600, lineHeight: '1rem' }}>
      {required ? 'Required' : 'Optional'}
    </Text>
  </Flex>
);
