import { Flex } from 'antd';
import { FC, PropsWithChildren } from 'react';

interface ILeadsFiltersManagerProps extends PropsWithChildren {}

export const LeadsFiltersManager: FC<ILeadsFiltersManagerProps> = ({
  children,
}) => {
  return <Flex justify='space-between'>{children}</Flex>;
};
