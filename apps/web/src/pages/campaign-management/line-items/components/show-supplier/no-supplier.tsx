import { Flex } from 'antd';
import { FC } from 'react';
import styles from './no-supplier.module.css';

interface INoSupplierProps {
  handleEditing: () => void;
}

export const NoSupplier: FC<INoSupplierProps> = ({ handleEditing }) => {
  return (
    <Flex
      onClick={(e) => {
        e.stopPropagation();
        handleEditing();
      }}
      className={styles.assignSupplier}>
      <em>Assign Supplier</em>
    </Flex>
  );
};
