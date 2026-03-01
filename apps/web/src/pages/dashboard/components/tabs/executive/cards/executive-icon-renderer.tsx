import { type FC } from 'react';
import {
  CaretUpOutlined,
  CaretDownOutlined,
  MinusOutlined,
} from '@ant-design/icons';

interface ExecutiveIconRendererProps {
  isPositive: boolean | null;
}

export const ExecutiveIconRenderer: FC<ExecutiveIconRendererProps> = ({
  isPositive,
}) => {
  if (isPositive === true) {
    return (
      <CaretUpOutlined style={{ color: '#90BE6D', fontSize: '1.25rem' }} />
    );
  } else if (isPositive === false) {
    return (
      <CaretDownOutlined style={{ color: '#F64C4C', fontSize: '1.25rem' }} />
    );
  }
  return <MinusOutlined style={{ color: '#000', fontSize: '1.25rem' }} />;
};
