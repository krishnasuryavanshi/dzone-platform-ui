import { DeleteOutlined } from '@ant-design/icons';
import { FC } from 'react';

interface IDeleteFieldButtonProps {
  onClick: () => void;
}

export const DeleteFieldButton: FC<IDeleteFieldButtonProps> = ({ onClick }) => {
  return (
    <DeleteOutlined
      style={{ color: 'red', fontSize: '1.5rem', cursor: 'pointer' }}
      onClick={onClick}
    />
  );
};
