import React, { FC } from 'react';

interface IContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  dzOneBox?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DzBox: FC<IContainerProps> = ({ children, className, style, dzOneBox, ...rest }) => {
  return (
    <div
      className={`dz-box ${dzOneBox ? 'dz-one-box' : ''} ${className || ''}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};
