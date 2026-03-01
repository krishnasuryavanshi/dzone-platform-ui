// TODO: Migrate TextView and other shared text components from dzone-ui
// Source: dzone-ui/src/components/shared/text/
import { FC } from 'react';

interface ITextViewProps {
  value: string;
  label: string;
  lines?: number;
}

/**
 * Stub component for TextView - displays text with truncation and expand drawer.
 * Migrate full implementation from dzone-ui/src/components/shared/text/text-view.tsx
 */
export const TextView: FC<ITextViewProps> = ({ value }) => {
  return value as unknown as React.ReactElement;
};

export const DrawerFullText: FC<{
  show: boolean;
  value: string;
  label: string;
  handleClose: () => void;
}> = () => {
  return null;
};

export const TruncatedText: FC<{
  lines?: number;
  handleExpand?: () => void;
  children?: React.ReactNode;
}> = ({ children }) => {
  return children as unknown as React.ReactElement;
};

export const DrawerListView: FC<{
  value?: string[];
  label?: string;
}> = () => {
  return null;
};

export const DrawerShowList: FC<{
  value?: string[];
  label?: string;
}> = () => {
  return null;
};
