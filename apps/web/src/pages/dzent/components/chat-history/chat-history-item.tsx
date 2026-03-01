import { type FC } from 'react';
import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface ChatHistoryItemProps {
  conversation: Record<string, any>;
  isActive: boolean;
  onClick: () => void;
}

export const ChatHistoryItem: FC<ChatHistoryItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  return (
    <Flex
      align="center"
      style={{
        padding: '0.5rem 0.75rem',
        borderRadius: 6,
        cursor: 'pointer',
        backgroundColor: isActive ? '#e6f4ff' : 'transparent',
      }}
      onClick={onClick}
    >
      <Text
        ellipsis
        style={{
          fontSize: '0.8125rem',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {conversation.title || 'Untitled'}
      </Text>
    </Flex>
  );
};
