import { type FC, type ReactNode } from 'react';
import { Flex, Typography } from 'antd';
import { MapFunction } from '@dzone/shared-ui';

const { Text } = Typography;

type DzRecord = Record<string, any>;

interface CustomQuestionsContentProps {
  customQuestions: DzRecord[];
  children?: ReactNode;
}

export const UserCustomQuestionsContent: FC<CustomQuestionsContentProps> = ({
  customQuestions,
  children,
}) => {
  return (
    <Flex vertical gap="0.5rem">
      {children}
      <MapFunction
        items={customQuestions}
        renderItem={(questionItem: DzRecord, index: number) => (
          <Flex key={index} vertical gap="0.5rem">
            <Text strong style={{ fontSize: '0.875rem', color: '#fff' }}>
              {index + 1}) {questionItem.question}
            </Text>
            <Flex style={{ marginLeft: '0.5rem' }}>
              <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                <strong>Accepted: </strong>{questionItem.accepted}
              </Text>
            </Flex>
            <Flex style={{ marginLeft: '0.5rem' }}>
              <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                <strong>Rejected: </strong>{questionItem.rejected}
              </Text>
            </Flex>
          </Flex>
        )}
      />
    </Flex>
  );
};
