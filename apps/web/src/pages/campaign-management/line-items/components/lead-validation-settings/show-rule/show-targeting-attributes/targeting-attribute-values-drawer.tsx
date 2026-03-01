import { Drawer, Typography, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { PropsWithChildren } from 'react';

const { Text } = Typography;

interface ITargetingAttributeValuesDrawerProps extends PropsWithChildren {
  isOpen: boolean;
  header: string;
  handleClose: () => void;
}
export const TargetingAttributeValuesDrawer = ({
  isOpen,
  header,
  handleClose,
  children,
}: ITargetingAttributeValuesDrawerProps) => {
  return (
    <Drawer
      className='dz-drawer targeting-attribute-values-drawer '
      closable
      destroyOnClose
      maskClosable={false}
      placement='right'
      closeIcon={<Button icon={<CloseOutlined />} type='text' />}
      title={<Text strong>{header}</Text>}
      open={isOpen}
      onClose={handleClose}>
      {children}
    </Drawer>
  );
};
