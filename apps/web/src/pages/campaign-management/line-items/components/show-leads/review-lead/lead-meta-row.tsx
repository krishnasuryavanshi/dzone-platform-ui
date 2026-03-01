import { Flex, Typography } from 'antd';
import { FC, PropsWithChildren } from 'react';

const { Text } = Typography;

interface ILeadMetaRowProps extends PropsWithChildren {
  className?: string;
  label?: string;
}

export const LeadMetaRow: FC<ILeadMetaRowProps> = ({
  children,
  className,
  label,
}) => {
  return (
    <Flex className={className} vertical gap={'0.25rem'}>
      <Text strong>{label}</Text>
      {children}
    </Flex>
  );
};
