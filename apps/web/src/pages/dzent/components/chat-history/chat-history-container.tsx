import { type FC } from 'react';
import { Button, Flex, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Hideable, MapFunction } from '@dzone/shared-ui';
import { useDzentStore } from '../../stores/use-dzent-store';
import { ChatHistoryItem } from './chat-history-item';

const { Text } = Typography;

interface ChatHistoryContainerProps {
  fullHeight?: boolean;
}

export const ChatHistoryContainer: FC<ChatHistoryContainerProps> = ({ fullHeight }) => {
  const {
    chatHistory,
    activeHistoricalConversation,
    setActiveHistoricalConversation,
    initializeChat,
  } = useDzentStore();

  const handleNewChat = () => {
    initializeChat();
  };

  return (
    <Flex
      vertical
      style={{
        height: fullHeight ? '100%' : 'auto',
        flex: fullHeight ? 1 : 'auto',
      }}
    >
      <Flex justify="space-between" align="center" style={{ padding: '0.5rem 0' }}>
        <Text strong style={{ fontSize: '0.875rem' }}>Conversations</Text>
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
        />
      </Flex>
      <Flex
        vertical
        gap="0.25rem"
        style={{ flex: 1, overflow: 'auto', minHeight: 0 }}
        className="show-scroll"
      >
        <Hideable show={!!chatHistory?.length}>
          <MapFunction
            items={chatHistory || []}
            renderItem={(item: Record<string, any>) => (
              <ChatHistoryItem
                key={item.conversationId}
                conversation={item}
                isActive={activeHistoricalConversation?.conversationId === item.conversationId}
                onClick={() => setActiveHistoricalConversation(item)}
              />
            )}
          />
        </Hideable>
      </Flex>
    </Flex>
  );
};
