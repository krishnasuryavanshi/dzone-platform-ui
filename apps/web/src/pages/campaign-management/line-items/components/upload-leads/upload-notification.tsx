import { Flex, Typography } from 'antd';
import { FC, PropsWithChildren } from 'react';
import {
  CheckCircleOutlined,
  CloseOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import './upload-notification.css';

const { Text } = Typography;

interface IUploadNotificationProps extends PropsWithChildren {
  message?: string;
  show: boolean;
  type: string;
  onClose?: () => void;
}

export const UploadNotification: FC<IUploadNotificationProps> = ({
  show,
  type,
  message,
  onClose,
  children,
}) => {
  if (!show) return null;
  return (
    <Flex
      vertical
      gap="1.75rem"
      className={`dz-one-upload-notification ${type}`}>
      <Flex
        align="flex-start"
        gap="0.75rem">
        {type === 'Success' ? (
          <CheckCircleOutlined className="icon success" />
        ) : (
          <WarningOutlined className="icon error" />
        )}
        <Text
          className="text"
          strong>
          {message}
        </Text>
        <CloseOutlined
          color="#000"
          style={{ cursor: 'pointer', marginLeft: 'auto' }}
          onClick={onClose}
        />
      </Flex>
      <Flex
        justify="center"
        flex={1}>
        {children}
      </Flex>
    </Flex>
  );
};
