import { FC, useState } from 'react';
import { Row } from 'antd';
import { FormControlItemContent } from '../../../../components';

interface ICustomInputProps {
  customProps?: Record<string, any>;
  value?: any[];
}

export const CustomInput: FC<ICustomInputProps> = ({ customProps }) => {
  const [colLayout] = useState({
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  });

  return (
    <Row gutter={[24, 24]}>
      {customProps?.childrenFields.map((childField: any, index: number) => {
        return (
          <FormControlItemContent
            key={childField?.field || index}
            item={childField}
            colLayout={colLayout}
            lists={customProps?.lists}
            transKey={customProps?.transKey}
          />
        );
      })}
    </Row>
  );
};
