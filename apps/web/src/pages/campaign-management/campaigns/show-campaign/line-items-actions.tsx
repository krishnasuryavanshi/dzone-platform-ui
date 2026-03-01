import { FC } from 'react';
import { Flex } from 'antd';
import { ButtonAddLineItem } from './button-add-line-item';

export const LineItemsActions: FC = () => {
  return (
    <Flex gap="1rem" align="center">
      <ButtonAddLineItem />
    </Flex>
  );
};
