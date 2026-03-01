import { Flex } from 'antd';
import { FC } from 'react';

interface ILineItemsFilesContainerProps {
  show: boolean;
}

export const LineItemsFilesContainer: FC<ILineItemsFilesContainerProps> = ({
  show,
}) => {
  if (!show) {
    return null;
  }
  return (
    <Flex vertical gap='0.75rem'>
      <Flex>
        <div style={{ height: '40vh', width: '100%' }}></div>
      </Flex>
    </Flex>
  );
};
