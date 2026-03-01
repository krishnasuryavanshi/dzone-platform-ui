import { type FC, type ReactNode } from 'react';
import { Avatar, Flex } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

interface SystemMessageWrapperProps {
  children: ReactNode;
}

export const SystemMessageWrapper: FC<SystemMessageWrapperProps> = ({
  children,
}) => {
  return (
    <Flex gap="0.75rem" align="flex-start">
      <Avatar
        size={32}
        icon={<RobotOutlined />}
        style={{ backgroundColor: '#235AED', flexShrink: 0 }}
      />
      <Flex vertical style={{ flex: 1, minWidth: 0 }}>
        {children}
      </Flex>
    </Flex>
  );
};
