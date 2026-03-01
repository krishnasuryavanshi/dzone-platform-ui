import React from 'react';
import { Tooltip } from 'antd';

type CustomTooltipProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export const CustomTooltip = ({ title, children }: CustomTooltipProps) => {
  return (
    <Tooltip
      title={title}
      overlayStyle={{
        whiteSpace: 'wrap',
        background: 'white',
        maxWidth: '12.5rem',
      }}
      overlayInnerStyle={{
        fontSize: '0.875rem',
        textAlign: 'center',
        color: '#000',
        background: '#fff',
      }}
      arrow={false}>
      {children}
    </Tooltip>
  );
};
