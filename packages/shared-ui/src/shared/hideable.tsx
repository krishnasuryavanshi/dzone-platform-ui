import { type FC, type PropsWithChildren } from 'react';

interface IHideableProps extends PropsWithChildren {
  show: boolean;
}

export const Hideable: FC<IHideableProps> = ({ children, show }) => {
  if (!show) return null;
  return <>{children}</>;
};
