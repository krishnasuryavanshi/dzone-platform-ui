import { type FC, type ReactNode } from 'react';
import { Flex, Typography, Skeleton } from 'antd';

const { Text, Title } = Typography;

interface CountCardProps {
  title: string | ReactNode;
  value: string | number | ReactNode;
}

export const CountCard: FC<CountCardProps> = ({ title, value }) => {
  return (
    <Flex
      vertical
      gap="0.75rem"
      style={{
        padding: '0.75rem 1rem',
        height: '6rem',
        background: '#f5f5f5',
        borderRadius: '6px',
      }}>
      <Text style={{ fontSize: '0.875rem', fontWeight: 500, color: '#000', lineHeight: 'normal' }}>
        {title || <Skeleton.Input active style={{ height: '1.5rem', width: '150%' }} />}
      </Text>
      <Title
        level={4}
        style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 500,
          color: '#000',
          lineHeight: 'normal',
        }}>
        {value || <Skeleton.Input active style={{ height: '1.5rem' }} />}
      </Title>
    </Flex>
  );
};
