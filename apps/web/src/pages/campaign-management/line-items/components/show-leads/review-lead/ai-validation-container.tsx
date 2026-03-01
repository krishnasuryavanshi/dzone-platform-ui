import { Flex, Typography } from 'antd';
import { FC } from 'react';

// TODO: AiPen icon not available in platform yet
// import { AiPen } from '@ant-design/icons';

const { Text } = Typography;

interface IAiValidationContainerProps {}

export const AIValidationContainer: FC<IAiValidationContainerProps> = ({}) => {
  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{
        borderRadius: '8px',
        border: '2px solid #3D71FB',
      }}>
      <Flex
        align='center'
        style={{
          borderRadius: '8px',
          margin: '0.5rem',
          border: '2px solid #3D71FB',
        }}>
        <Text strong style={{ color: '#3D71FB' }}>
          DZ One AI Copilot
        </Text>
        {/* <AiPen /> */}
      </Flex>
      <Text style={{ padding: '0 0.5rem' }}>
        See <Text strong>7</Text> suggessions
      </Text>
    </Flex>
  );
};
