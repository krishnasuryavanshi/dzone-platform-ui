import { FC } from 'react';
import { Flex } from 'antd';

interface IFilesContainerProps {
  show: boolean;
}

export const FilesContainer: FC<IFilesContainerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Flex vertical gap="0.75rem">
      <div style={{ height: '40vh', width: '100%' }} />
    </Flex>
  );
};
