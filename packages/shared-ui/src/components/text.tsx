import { type FC, type PropsWithChildren } from 'react';
import { Typography } from 'antd';
import type { TextProps } from 'antd/lib/typography/Text';

interface ITextProps extends TextProps, PropsWithChildren {
  text14?: boolean;
  text12?: boolean;
  text10?: boolean;
}

export const Text: FC<ITextProps> = ({ children, ...restProps }) => {
  if (restProps.text14) {
    restProps.style = { ...restProps.style, fontSize: '0.875rem' };
  } else if (restProps.text12) {
    restProps.style = { ...restProps.style, fontSize: '0.75rem' };
  } else if (restProps.text10) {
    restProps.style = { ...restProps.style, fontSize: '0.625rem' };
  }
  return <Typography.Text {...restProps}>{children}</Typography.Text>;
};
