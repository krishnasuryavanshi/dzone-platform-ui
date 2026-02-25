import { type FC } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button } from '../components';
import type { ButtonProps } from 'antd/lib/button';

export const LoaderButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      type="primary"
      htmlType="submit"
      {...props}
      style={{ width: '4.5rem', ...props.style }}
    >
      <LoadingOutlined />
    </Button>
  );
};
