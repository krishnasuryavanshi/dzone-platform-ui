import { type FC, type ReactNode } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface TextContentProps {
  data: string;
  children?: ReactNode;
}

export const UserTextContent: FC<TextContentProps> = ({ data, children }) => {
  return (
    <>
      {children}
      <Text style={{ fontSize: '0.875rem', color: 'inherit' }}>{data}</Text>
    </>
  );
};
