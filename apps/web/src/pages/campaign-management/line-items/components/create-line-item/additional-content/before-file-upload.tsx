import { Flex, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

interface IBeforeFileUploadProps {}

export const BeforeFileUpload: FC<IBeforeFileUploadProps> = ({}) => {
  return (
    <Flex style={{ marginRight: '0.5rem' }}>
      <Text
        style={{
          color: '#000',
          fontSize: '1.25rem',
          fontWeight: 600,
          wordBreak: 'normal',
        }}>
        Or
      </Text>
    </Flex>
  );
};
