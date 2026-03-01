import { Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

interface IViewSupplierProps {
  supplierName: string;
}

export const ViewSupplier: FC<IViewSupplierProps> = ({ supplierName }) => {
  return <Text style={{ fontSize: '0.875rem' }}>{supplierName}</Text>;
};
