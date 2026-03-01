import { type FC, type ReactNode } from 'react';
import { Typography, Skeleton } from 'antd';

const { Text } = Typography;

interface ExecutiveCardTitleProps {
  title: string | ReactNode;
}

export const ExecutiveCardTitle: FC<ExecutiveCardTitleProps> = ({ title }) => {
  return (
    <Text
      style={{
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#000',
        lineHeight: 'normal',
      }}
    >
      {title || (
        <Skeleton.Input
          active
          style={{ height: '1.5rem', width: '100%' }}
        />
      )}
    </Text>
  );
};
