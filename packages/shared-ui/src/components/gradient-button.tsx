import { type FC } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

const gradientStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: '0.3125rem',
  background:
    'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
  border: '1.5px solid transparent',
  color: '#000',
  height: '2.25rem',
};

export const GradientButton: FC<ButtonProps> = ({ style, ...props }) => (
  <Button {...props} style={{ ...gradientStyle, ...style }} />
);
