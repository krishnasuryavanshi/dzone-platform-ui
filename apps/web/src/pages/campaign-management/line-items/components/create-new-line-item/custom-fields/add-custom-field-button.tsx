import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FC } from 'react';

interface IAddCustomFieldButtonProps {
  add: () => void;
  disabled?: boolean;
}

export const AddCustomFieldButton: FC<IAddCustomFieldButtonProps> = ({
  add,
  disabled,
}) => {
  return (
    <Button
      type='primary'
      style={{ marginBottom: '0.5rem', maxWidth: '15rem' }}
      onClick={add}
      disabled={disabled}
      icon={<PlusOutlined />}>
      Add Custom Fields
    </Button>
  );
};
